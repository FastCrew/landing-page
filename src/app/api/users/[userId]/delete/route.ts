import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/db'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId: clerkUserId } = await auth()

        if (!clerkUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get the admin's profile
        const adminProfile = await prisma.profile.findUnique({
            where: { id: clerkUserId },
        })

        if (!adminProfile || adminProfile.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
        }

        const { userId } = await params

        // Prevent admin from deleting themselves
        if (userId === clerkUserId) {
            return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
        }

        // Perform cascading delete in a transaction
        await prisma.$transaction(async (tx) => {
            // 1. Delete reviews where user is the rater
            await tx.review.deleteMany({
                where: { raterId: userId },
            })

            // 2. Delete reviews where user is the ratee
            await tx.review.deleteMany({
                where: { rateeId: userId },
            })

            // 3. Delete bookings where user is the confirmer
            await tx.booking.deleteMany({
                where: { confirmedBy: userId },
            })

            // 4. For jobs created by this user, we need to:
            //    - Delete all bookings associated with applications for these jobs
            //    - Delete all applications for these jobs
            //    - Delete reviews for these jobs
            //    - Delete the jobs themselves

            const userJobs = await tx.job.findMany({
                where: { createdBy: userId },
                select: { id: true },
            })

            const jobIds = userJobs.map((job) => job.id)

            if (jobIds.length > 0) {
                // Get all applications for these jobs
                const jobApplications = await tx.application.findMany({
                    where: { jobId: { in: jobIds } },
                    select: { id: true },
                })

                const applicationIds = jobApplications.map((app) => app.id)

                if (applicationIds.length > 0) {
                    // Delete bookings for these applications
                    await tx.booking.deleteMany({
                        where: { applicationId: { in: applicationIds } },
                    })
                }

                // Delete reviews for these jobs
                await tx.review.deleteMany({
                    where: { jobId: { in: jobIds } },
                })

                // Delete applications for these jobs
                await tx.application.deleteMany({
                    where: { jobId: { in: jobIds } },
                })

                // Delete the jobs
                await tx.job.deleteMany({
                    where: { id: { in: jobIds } },
                })
            }

            // 5. Delete applications where user is the worker
            const workerApplications = await tx.application.findMany({
                where: { workerId: userId },
                select: { id: true },
            })

            const workerApplicationIds = workerApplications.map((app) => app.id)

            if (workerApplicationIds.length > 0) {
                // Delete bookings for these applications
                await tx.booking.deleteMany({
                    where: { applicationId: { in: workerApplicationIds } },
                })

                // Delete the applications
                await tx.application.deleteMany({
                    where: { workerId: userId },
                })
            }

            // 6. Finally, delete the profile
            await tx.profile.delete({
                where: { id: userId },
            })
        })

        return NextResponse.json({
            success: true,
            message: 'User and all associated data deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json(
            { error: 'Failed to delete user', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
