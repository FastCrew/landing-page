import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createJob } from '@/lib/supabase/server'

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
        const { title, description, location, hourlyRate, joiningBy } = body

        if (!title || !description || !location || !hourlyRate) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const job = await createJob({
            createdBy: userId,
            title,
            description,
            location,
            hourlyRate: parseFloat(hourlyRate),
            joiningBy: joiningBy ? new Date(joiningBy) : undefined,
            status: 'open',
        })

        return NextResponse.json({ job })
    } catch (error: any) {
        console.error('Error creating job:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to create job' },
            { status: 500 }
        )
    }
}
