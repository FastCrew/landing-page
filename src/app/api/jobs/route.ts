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
        const status = searchParams.get('status')
        const businessId = searchParams.get('businessId')

        let where: any = {}

        if (status && status !== 'all') {
            where.status = status
        }

        if (businessId) {
            where.createdBy = businessId
        }

        const jobs = await prisma.job.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        companyName: true,
                    }
                }
            }
        })

        return NextResponse.json({ jobs })
    } catch (error) {
        console.error('Error fetching jobs:', error)
        return NextResponse.json(
            { error: 'Failed to fetch jobs' },
            { status: 500 }
        )
    }
}
