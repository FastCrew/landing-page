import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { getProfile } from '@/lib/auth/roles'

export async function GET(request: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Check if user is admin
        const profile = await getProfile(userId)
        if (!profile || profile.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            )
        }

        const profiles = await prisma.profile.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ profiles })
    } catch (error) {
        console.error('Error fetching profiles:', error)
        return NextResponse.json(
            { error: 'Failed to fetch profiles' },
            { status: 500 }
        )
    }
}
