import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { type Job, type Application, type Profile, createJobSchema, createApplicationSchema } from '@/db/schema'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/db'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'example-key'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Missing Supabase environment variables, using placeholders')
}

// Service role client for server-side operations (keeping for compatibility)
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Server-side operations with Prisma
export async function createJob(jobData: {
  createdBy: string
  title: string
  description: string
  location: string
  hourlyRate: number
  joiningBy?: Date
  status?: 'open' | 'closed' | 'filled'
}) {
  const validated = createJobSchema.parse({
    ...jobData,
    status: jobData.status || 'open'
  })

  const job = await prisma.job.create({
    data: {
      createdBy: validated.createdBy,
      title: validated.title,
      description: validated.description,
      location: validated.location,
      hourlyRate: validated.hourlyRate,
      joiningBy: validated.joiningBy,
      status: validated.status || 'open',
    }
  })

  return job
}

export async function createApplication(applicationData: {
  jobId: string
  workerId: string
  coverNote?: string
}) {
  const validated = createApplicationSchema.parse(applicationData)

  // Check if application already exists
  const existing = await prisma.application.findFirst({
    where: {
      jobId: validated.jobId,
      workerId: validated.workerId,
    }
  })

  if (existing) {
    throw new Error('Application already submitted')
  }

  const application = await prisma.application.create({
    data: {
      jobId: validated.jobId,
      workerId: validated.workerId,
      coverNote: validated.coverNote,
    }
  })

  return application
}

export async function updateProfileRole(profileId: string, newRole: string) {
  const profile = await prisma.profile.update({
    where: { id: profileId },
    data: {
      role: newRole as any,
      businessRequested: newRole === 'worker' ? false : undefined,
    }
  })

  return profile
}

export async function updateApplicationStatus(applicationId: string, status: string, businessId: string) {
  // Verify the business owns the job
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        select: { createdBy: true }
      }
    }
  })

  if (!application) {
    throw new Error('Application not found')
  }

  if (application.job.createdBy !== businessId) {
    throw new Error('Unauthorized: You can only update applications for your jobs')
  }

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: { status: status as any }
  })

  return updated
}

export async function deleteApplication(applicationId: string, workerId: string) {
  // Verify the worker owns the application
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  })

  if (!application) {
    throw new Error('Application not found')
  }

  if (application.workerId !== workerId) {
    throw new Error('Unauthorized: You can only delete your own applications')
  }

  await prisma.application.delete({
    where: { id: applicationId }
  })

  return { success: true }
}