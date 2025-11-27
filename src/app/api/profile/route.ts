import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createProfile, getProfile } from '@/lib/auth/roles'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('[Profile API] Request body:', body)
    const { role, name, phone, city, skills, companyName, companyVat } = body

    // Validate required fields
    if (!role || !name || !city) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user info from Clerk using clerkClient
    const { clerkClient } = await import('@clerk/nextjs/server')
    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    console.log('[Profile API] User email addresses:', user.emailAddresses)
    console.log('[Profile API] Primary email ID:', user.primaryEmailAddressId)

    // ONLY use primary email - no fallbacks
    const userEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress

    if (!userEmail) {
      console.error(
        '[Profile API - ADMIN ACTION REQUIRED] User does not have a primary email set.',
        '\nUser ID:', userId,
        '\nAvailable emails:', user.emailAddresses.map(e => e.emailAddress),
        '\nAction: Set a primary email for this user in Clerk Dashboard'
      )
      return NextResponse.json(
        { error: 'Primary email not configured. Please contact support.' },
        { status: 400 }
      )
    }

    console.log('[Profile API] Creating profile with email:', userEmail)

    const profile = await createProfile({
      userId,
      email: userEmail,
      role: role as 'worker' | 'business' | 'admin',
      name,
      phone,
      city,
      skills: skills ? skills.split(',').map((s: string) => s.trim()) : undefined,
      companyName,
      companyVat,
    })

    // Update Clerk metadata to mark onboarding as complete
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        profileRole: profile.role
      }
    })

    console.log('[Profile API] Profile created and metadata updated:', profile.id)
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('[Profile API] Profile creation error:', error)
    if (error instanceof Error) {
      console.error('[Profile API] Error stack:', error.stack)
    }
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const profile = await getProfile(userId)

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}