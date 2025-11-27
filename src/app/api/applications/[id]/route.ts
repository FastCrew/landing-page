import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { updateApplicationStatus, deleteApplication } from '@/lib/supabase/server'

export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { status } = body

        if (!status) {
            return NextResponse.json(
                { error: 'Missing required field: status' },
                { status: 400 }
            )
        }

        const application = await updateApplicationStatus(params.id, status, userId)

        return NextResponse.json({ application })
    } catch (error: any) {
        console.error('Error updating application:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to update application' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await deleteApplication(params.id, userId)

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Error deleting application:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to delete application' },
            { status: 500 }
        )
    }
}

