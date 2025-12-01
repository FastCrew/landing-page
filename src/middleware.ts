import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/db'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/clerk(.*)',
  '/api/uploads(.*)'
])

const isProtectedRoute = createRouteMatcher([
  '/onboarding',
  '/dashboard(.*)',
  '/admin(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // Allow public routes without any checks
  if (isPublicRoute(req)) {
    // Redirect authenticated users from auth pages to onboarding or admin dashboard
    if (userId && (req.nextUrl.pathname === '/sign-in' || req.nextUrl.pathname === '/sign-up')) {
      try {
        const { clerkClient } = await import('@clerk/nextjs/server')
        const client = await clerkClient()
        const user = await client.users.getUser(userId)

        // Check if user is admin based on email
        let adminEmails: string[] = []
        if (process.env.ADMIN_EMAILS) {
          try {
            adminEmails = JSON.parse(process.env.ADMIN_EMAILS)
            if (!Array.isArray(adminEmails)) throw new Error('Not an array')
          } catch {
            adminEmails = process.env.ADMIN_EMAILS.split(',').map(e => e.trim())
          }
        }

        const isAdminEmail = user.emailAddresses.some(email =>
          adminEmails.includes(email.emailAddress)
        )

        if (isAdminEmail) {
          return NextResponse.redirect(new URL('/dashboard/admin', req.url))
        }
      } catch (error) {
        console.error('[Middleware] Error checking admin status on public route:', error)
      }

      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
    return NextResponse.next()
  }

  // Handle unauthenticated users on protected routes
  if (!userId && isProtectedRoute(req)) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // If authenticated, check email verification and onboarding status for protected routes
  if (userId && isProtectedRoute(req)) {
    try {
      const { clerkClient } = await import('@clerk/nextjs/server')
      const client = await clerkClient()
      const user = await client.users.getUser(userId)

      // Check email verification (only in production)
      const requireEmailVerification = process.env.NODE_ENV === 'production'

      const hasVerifiedEmail = user.emailAddresses.some(email =>
        email.id === user.primaryEmailAddressId &&
        (!requireEmailVerification || email.verification?.status === 'verified')
      )

      if (!hasVerifiedEmail) {
        console.log('[Middleware] User email not verified, redirecting to sign-in')
        return NextResponse.redirect(new URL('/sign-in', req.url))
      }

      // Check if user is admin based on email
      let adminEmails: string[] = []
      if (process.env.ADMIN_EMAILS) {
        try {
          adminEmails = JSON.parse(process.env.ADMIN_EMAILS)
          if (!Array.isArray(adminEmails)) throw new Error('Not an array')
        } catch {
          adminEmails = process.env.ADMIN_EMAILS.split(',').map(e => e.trim())
        }
      }

      const isAdminEmail = user.emailAddresses.some(email =>
        adminEmails.includes(email.emailAddress)
      )

      // Check onboarding status from Clerk metadata
      const hasCompletedOnboarding = user.publicMetadata?.onboardingComplete === true

      // If accessing /onboarding
      if (req.nextUrl.pathname === '/onboarding') {
        // If admin, redirect to admin dashboard
        if (isAdminEmail) {
          console.log('[Middleware] Admin user on onboarding, redirecting to admin dashboard')
          return NextResponse.redirect(new URL('/dashboard/admin', req.url))
        }
        // If already completed, redirect based on role
        if (hasCompletedOnboarding) {
          console.log('[Middleware] User already onboarded, checking role for redirect')

          try {
            const profile = await prisma.profile.findUnique({
              where: { id: userId },
              select: { role: true }
            })

            if (profile?.role === 'worker') {
              console.log('[Middleware] Worker onboarded, redirecting to homepage')
              return NextResponse.redirect(new URL('/', req.url))
            }
          } catch (error) {
            console.error('[Middleware] Error fetching profile role:', error)
          }

          console.log('[Middleware] User already onboarded, redirecting to dashboard')
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
      }

      // If accessing /dashboard but not onboarded yet
      if (req.nextUrl.pathname.startsWith('/dashboard') && !hasCompletedOnboarding) {
        // If admin, allow access (don't redirect)
        if (isAdminEmail) {
          console.log('[Middleware] Admin user not onboarded, allowing access to dashboard')
        } else {
          console.log('[Middleware] User not onboarded, redirecting to onboarding')
          return NextResponse.redirect(new URL('/onboarding', req.url))
        }
      }

      // If accessing /admin, verify admin role from database or email list
      if (req.nextUrl.pathname.startsWith('/admin')) {
        if (!isAdminEmail) {
          const profile = await prisma.profile.findUnique({
            where: { id: userId },
            select: { role: true }
          })

          if (profile?.role !== 'admin') {
            console.log('[Middleware] User is not admin, redirecting to dashboard')
            return NextResponse.redirect(new URL('/dashboard', req.url))
          }
        }
      }
    } catch (error) {
      console.error('[Middleware] Error checking user status:', error)
      // On error, redirect to sign-in to be safe
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    // Enable API routes
    '/(api|trpc)(.*)',
  ],
}