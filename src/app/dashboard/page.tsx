'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserButton } from '@/components/user-button'
import { redirect } from 'next/navigation'

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return

      try {
        const response = await fetch(`/api/profile/${user.id}`)

        if (!response.ok) {
          router.push('/onboarding')
          return
        }

        const { profile } = await response.json()

        if (!profile) {
          router.push('/onboarding')
          return
        }

        // Redirect based on role
        if (profile.role === 'worker') {
          router.push('/dashboard/worker')
        } else if (profile.role === 'business') {
          router.push('/dashboard/business')
        } else if (profile.role === 'admin') {
          router.push('/dashboard/admin')
        }
      } catch (error) {
        console.error('Error checking profile:', error)
        router.push('/onboarding')
      }
    }

    checkProfile()
  }, [user, router])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Fastcrew Dashboard</h1>
          <UserButton />
        </div>
        <div>Loading dashboard...</div>
      </div>
    </div>
  )
}