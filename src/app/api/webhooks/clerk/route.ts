import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { createProfile } from '@/lib/auth/roles'

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_SECRET_KEY

  if (!webhookSecret) {
    throw new Error('Missing Clerk webhook secret')
  }

  const payload = await req.text()
  const headerPayload = await headers()

  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', {
      status: 400,
    })
  }

  let evt: any

  try {
    const wh = new Webhook(webhookSecret)
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Invalid signature', {
      status: 400,
    })
  }

  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const user = evt.data

    try {
      await createProfile({
        userId: user.id,
        email: user.email_addresses[0]?.email_address || '',
        role: 'worker',
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'User',
        phone: user.phone_numbers?.[0]?.phone_number || '',
        city: '',
        skills: undefined,
      })
    } catch (error) {
      console.error('Error creating/updating profile:', error)
      // Profile might already exist, so don't throw error
    }
  }

  return new Response('Success', { status: 200 })
}