import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getProfile, createProfile } from '@/lib/auth/roles'
import { updateProfileRole } from '@/lib/supabase/server'

export async function GET(
    request: Request,
    props: { params: Promise<{ userId: string }> }
) {
    try {
        const params = await props.params
        const { userId: authUserId } = await auth()

        if (!authUserId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Users can only fetch their own profile unless they're admin
        // For now, we'll allow users to fetch their own profile
        let profile = await getProfile(params.userId)

        if (!profile) {
            // Check if this is an admin user who hasn't completed onboarding
            // We only do this if the requested profile matches the authenticated user
            if (params.userId === authUserId) {
                try {
                    const { clerkClient } = await import('@clerk/nextjs/server')
                    const client = await clerkClient()
                    const user = await client.users.getUser(authUserId)

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
                        console.log('Admin user missing profile, creating one automatically')

                        const primaryEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId) || user.emailAddresses[0]

                        profile = await createProfile({
                            userId: authUserId,
                            email: primaryEmail.emailAddress,
                            role: 'admin',
                            name: user.fullName || 'Admin User',
                            city: 'Admin HQ',
                            phone: '',
                            skills: [],
                            companyName: '',
                            companyVat: ''
                        })
                    }
                } catch (err) {
                    console.error('Error checking/creating admin profile:', err)
                }
            }
        }

        if (!profile) {
            return NextResponse.json(
                { error: 'Profile not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ profile })
    } catch (error) {
        console.error('Error fetching profile:', error)
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: Request,
    props: { params: Promise<{ userId: string }> }
) {
    try {
        const params = await props.params
        const { userId: authUserId } = await auth()

        if (!authUserId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Check if the requesting user is an admin
        const adminProfile = await getProfile(authUserId)
        if (!adminProfile || adminProfile.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const { role } = body

        if (!role) {
            return NextResponse.json(
                { error: 'Missing required field: role' },
                { status: 400 }
            )
        }

        const profile = await updateProfileRole(params.userId, role)

        return NextResponse.json({ profile })
    } catch (error: any) {
        console.error('Error updating profile role:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to update profile role' },
            { status: 500 }
        )
    }
}
