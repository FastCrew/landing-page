'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@/components/user-button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
// All data fetching now done via API routes
import { MapPin, Clock, DollarSign, Building, FileText } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { Profile, Job, Application } from '@/db/schema'
import { ApplicationDetailsDialog } from '@/components/dashboard/ApplicationDetailsDialog'

export default function WorkerDashboard() {
  const { user } = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [coverNote, setCoverNote] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isApplicationDetailsOpen, setIsApplicationDetailsOpen] = useState(false)
  // Helper set of job IDs the worker has already applied to
  const appliedJobIds = new Set(applications.map((app) => app.jobId));

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    if (!user) return

    try {
      const [profileRes, jobsRes, applicationsRes] = await Promise.all([
        fetch(`/api/profile/${user.id}`),
        fetch('/api/jobs?status=open'),
        fetch(`/api/applications?workerId=${user.id}`)
      ])

      if (!profileRes.ok || !jobsRes.ok || !applicationsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [{ profile: profileData }, { jobs: jobsData }, { applications: applicationsData }] = await Promise.all([
        profileRes.json(),
        jobsRes.json(),
        applicationsRes.json()
      ])

      setProfile(profileData)
      setJobs(jobsData)
      setApplications(applicationsData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (job: Job) => {
    if (!user || !profile) return

    // Prevent duplicate applications
    if (appliedJobIds.has(job.id)) {
      toast({
        title: "Already Applied",
        description: "You have already applied for this job.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/applications/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: job.id,
          coverNote,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit application')
      }

      toast({
        title: "Application submitted!",
        description: "Your application has been sent to the business.",
      })

      setSelectedJob(null)
      setCoverNote('')
      loadData()
    } catch (error: any) {
      console.error('Error applying:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredJobs = jobs.filter(job =>
    job.location.toLowerCase().includes(searchCity.toLowerCase()) ||
    searchCity === ''
  )

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Worker Dashboard</h1>
            <p className="text-muted-foreground mt-1">Find and manage your work opportunities</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserButton />
          </div>
        </div>

        {/* Profile Summary */}
        {profile && (
          <Card className="mb-10 bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back, {profile.name}!</CardTitle>
              <CardDescription className="text-base">
                Your worker profile in {profile.city}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills && Array.isArray(profile.skills) && (profile.skills as string[]).map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 bg-background/50 backdrop-blur-sm">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="jobs" className="w-full space-y-8">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="jobs">Available Jobs</TabsTrigger>
              <TabsTrigger value="applications">My Applications</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Find Your Next Job</CardTitle>
                <CardDescription>
                  Browse available positions in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Input
                    placeholder="Search by city..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="max-w-md"
                  />
                </div>

                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <Card key={job.id} className="p-0 shadow-none border-0 bg-transparent">
                      <div className="p-5 rounded-2xl border bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-md">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-xl mb-2">{job.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {job.joiningBy ? `Joining by: ${new Date(job.joiningBy).toLocaleDateString()}` : 'Immediate joining'}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <DollarSign className="h-4 w-4" />
                                ${job.hourlyRate.toString()}/hr
                              </div>
                            </div>
                            <p className="text-muted-foreground leading-relaxed mb-4">{job.description}</p>
                          </div>
                          {appliedJobIds.has(job.id) ? (
                            <Button disabled className="rounded-full px-6 bg-gray-200 text-gray-500 cursor-not-allowed">
                              Applied
                            </Button>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button onClick={() => setSelectedJob(job)} className="rounded-full px-6">
                                  Apply Now
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Apply for {job.title}</DialogTitle>
                                  <DialogDescription>
                                    Tell the business why you're perfect for this role
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 mt-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="cover-note">Cover Note</Label>
                                    <Textarea
                                      id="cover-note"
                                      placeholder="Introduce yourself and highlight relevant experience..."
                                      value={coverNote}
                                      onChange={(e) => setCoverNote(e.target.value)}
                                      rows={5}
                                    />
                                  </div>
                                  <Button
                                    onClick={() => selectedJob && handleApply(selectedJob)}
                                    className="w-full h-12 text-base"
                                  >
                                    Submit Application
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>
                  Track the status of your job applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((application) => {
                    const job = jobs.find(j => j.id === application.jobId)
                    return (
                      <Card
                        key={application.id}
                        className="p-0 shadow-none border-0 bg-transparent cursor-pointer"
                        onClick={() => {
                          setSelectedApplication(application)
                          setIsApplicationDetailsOpen(true)
                        }}
                      >
                        <div className="p-5 rounded-2xl border bg-card/50 hover:bg-card transition-all hover:shadow-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{job?.title}</h3>
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                                <Building className="h-4 w-4" />
                                Applied on {new Date(application.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <Badge
                              className="px-3 py-1"
                              variant={
                                application.status === 'accepted' ? 'default' :
                                  application.status === 'rejected' ? 'destructive' :
                                    'secondary'
                              }
                            >
                              {application.status}
                            </Badge>
                          </div>
                          {application.coverNote && (
                            <div className="mt-4 p-4 bg-muted/50 rounded-xl text-sm leading-relaxed">
                              <div className="flex items-center gap-1.5 text-muted-foreground mb-2 font-medium">
                                <FileText className="h-4 w-4" />
                                Cover Note
                              </div>
                              <p className="line-clamp-2">{application.coverNote}</p>
                            </div>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {selectedApplication && (
        <ApplicationDetailsDialog
          application={selectedApplication}
          job={jobs.find(j => j.id === selectedApplication.jobId)}
          open={isApplicationDetailsOpen}
          onOpenChange={setIsApplicationDetailsOpen}
          onDelete={() => {
            setSelectedApplication(null)
            setIsApplicationDetailsOpen(false)
            loadData()
          }}
        />
      )}
    </div>
  )
}