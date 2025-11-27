import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { auth } from '@clerk/nextjs/server'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET!

export async function generateUploadUrl(fileName: string, fileType: string): Promise<string> {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const key = `uploads/${userId}/${Date.now()}-${fileName}`

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  })

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour

  return signedUrl
}

export async function uploadFile(file: File, path: string): Promise<string> {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${path}/${userId}/${Date.now()}.${fileExt}`

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: file,
    ContentType: file.type,
  })

  await s3Client.send(command)

  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
}