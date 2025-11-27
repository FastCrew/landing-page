import { NextRequest, NextResponse } from 'next/server'
import { generateUploadUrl } from '@/lib/s3'

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType } = await req.json()

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'Missing fileName or fileType' },
        { status: 400 }
      )
    }

    const uploadUrl = await generateUploadUrl(fileName, fileType)

    return NextResponse.json({ uploadUrl })
  } catch (error) {
    console.error('Error generating upload URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}