import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/db'

export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const params = await props.params
        const jobId = params.id
        const body = await request.json()

        // Verify ownership
        const job = await prisma.job.findUnique({
            where: { id: jobId },
        })

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        if (job.createdBy !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: {
                title: body.title,
                description: body.description,
                location: body.location,
                hourlyRate: body.hourlyRate ? parseFloat(body.hourlyRate) : undefined,
                joiningBy: body.joiningBy ? new Date(body.joiningBy) : undefined,
                status: body.status,
            },
        })

        return NextResponse.json({ job: updatedJob })
    } catch (error: any) {
        console.error('Error updating job:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to update job' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const params = await props.params
        const jobId = params.id

        // Verify ownership
        const job = await prisma.job.findUnique({
            where: { id: jobId },
        })

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        if (job.createdBy !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Delete associated applications first
        await prisma.application.deleteMany({
            where: { jobId: jobId },
        })

        // Delete the job
        await prisma.job.delete({
            where: { id: jobId },
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Error deleting job:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to delete job' },
            { status: 500 }
        )
    }
}
