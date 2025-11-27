import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createApplication } from '@/lib/supabase/server'

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
        const { jobId, coverNote } = body

        if (!jobId) {
            return NextResponse.json(
                { error: 'Missing required field: jobId' },
                { status: 400 }
            )
        }

        const application = await createApplication({
            jobId,
            workerId: userId,
            coverNote,
        })

        return NextResponse.json({ application })
    } catch (error: any) {
        console.error('Error creating application:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to create application' },
            { status: 500 }
        )
    }
}
