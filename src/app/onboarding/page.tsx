'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserButton } from '@/components/user-button'
import { ThemeToggle } from '@/components/theme-toggle'
import { toast } from '@/hooks/use-toast'
import { Briefcase, User } from 'lucide-react'

export default function OnboardingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    role: 'worker' as 'worker' | 'business',
    name: '',
    phone: '',
    city: '',
    skills: '',
    companyName: '',
    companyVat: '',
  })

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return

      // Check if email is verified (only in production)
      const requireEmailVerification = process.env.NODE_ENV === 'production'

      if (requireEmailVerification) {
        const primaryEmail = user.emailAddresses.find(
          (email) => email.id === user.primaryEmailAddressId
        )

        if (!primaryEmail?.verification || primaryEmail.verification.status !== 'verified') {
          toast({
            title: "Email verification required",
            description: "Please verify your email before completing onboarding.",
            variant: "destructive"
          })
          return
        }
      }

      try {
        // Check if profile already exists
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          if (data.profile) {
            toast({
              title: "Welcome back!",
              description: "Redirecting to your dashboard...",
            })
            router.push('/dashboard')
          }
        }
      } catch (error) {
        console.error('Error checking profile:', error)
      }
    }

    if (isLoaded && user) {
      checkProfile()
    }
  }, [user, isLoaded, router])

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: formData.role,
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          skills: formData.skills,
          companyName: formData.companyName,
          companyVat: formData.companyVat,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create profile')
      }

      toast({
        title: "Profile created!",
        description: "Welcome to Fastcrew!",
      })

      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating profile:', error)
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-bold tracking-tight">Fastcrew</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserButton />
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="border-none shadow-2xl bg-white/80 dark:bg-black/80 backdrop-blur-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold">Complete Your Profile</CardTitle>
              <CardDescription className="text-lg mt-2">
                Tell us about yourself to get started with Fastcrew
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Role Selection */}
                <div className="space-y-4">
                  <Label className="text-base">I want to join as:</Label>
                  <RadioGroup
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData(prev => ({ ...prev, role: value as 'worker' | 'business' }))
                    }
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="worker" id="worker" className="peer sr-only" />
                      <Label
                        htmlFor="worker"
                        className="flex flex-col items-center justify-between rounded-2xl border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all duration-200"
                      >
                        <User className="mb-3 h-6 w-6" />
                        <span className="font-semibold">Worker</span>
                        <span className="text-xs text-muted-foreground mt-1 text-center">Find jobs & shifts</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="business" id="business" className="peer sr-only" />
                      <Label
                        htmlFor="business"
                        className="flex flex-col items-center justify-between rounded-2xl border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all duration-200"
                      >
                        <Briefcase className="mb-3 h-6 w-6" />
                        <span className="font-semibold">Business Owner</span>
                        <span className="text-xs text-muted-foreground mt-1 text-center">Hire staff & post jobs</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Enter your city"
                    required
                    className="h-12"
                  />
                </div>

                {/* Worker-specific fields */}
                {formData.role === 'worker' && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Textarea
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                      placeholder="e.g. waiter, bartender, kitchen staff, cleaning"
                      rows={4}
                    />
                  </div>
                )}

                {/* Business-specific fields */}
                {formData.role === 'business' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Enter your company name"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyVat">GSTIN ID</Label>
                      <Input
                        id="companyVat"
                        value={formData.companyVat}
                        onChange={(e) => setFormData(prev => ({ ...prev, companyVat: e.target.value }))}
                        placeholder="Enter your GSTIN identification number"
                        className="h-12"
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
                  {loading ? 'Creating Profile...' : 'Create Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}