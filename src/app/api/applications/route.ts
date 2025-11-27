import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/db'

export async function GET(request: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const workerId = searchParams.get('workerId')
        const businessId = searchParams.get('businessId')

        let where: any = {}

        if (workerId) {
            where.workerId = workerId
        }

        if (businessId) {
            // Get applications for jobs created by this business
            where.job = {
                createdBy: businessId
            }
        }

        const applications = await prisma.application.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                job: {
                    select: {
                        id: true,
                        title: true,
                        location: true,
                        hourlyRate: true,
                        joiningBy: true,
                        status: true,
                    }
                },
                worker: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        skills: true,
                    }
                }
            }
        })

        return NextResponse.json({ applications })
    } catch (error) {
        console.error('Error fetching applications:', error)
        return NextResponse.json(
            { error: 'Failed to fetch applications' },
            { status: 500 }
        )
    }
}
