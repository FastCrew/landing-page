import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { type Job, type Application, type Profile } from '@/db/schema'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-key'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables, using placeholders')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Client-side queries (with RLS)

export async function getJobs(status?: 'open' | 'all' | 'closed', businessId?: string): Promise<Job[]> {
  let query = supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })

  if (status === 'open') {
    query = query.eq('status', 'open')
  } else if (status === 'closed') {
    query = query.eq('status', 'closed')
  }

  if (businessId) {
    query = query.eq('created_by', businessId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching jobs:', error)
    throw error
  }

  return data || []
}

export async function getApplications(workerId: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('worker_id', workerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    throw error
  }

  return data || []
}

export async function getApplicationsByBusiness(): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    throw error
  }

  return data || []
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching profiles:', error)
    throw error
  }

  return data || []
}

// Client-side upload utility
export async function uploadFile(file: File, path: string): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${path}/${Math.random()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(fileName, file)

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  const { data } = supabase.storage
    .from('uploads')
    .getPublicUrl(fileName)

  return data.publicUrl
}