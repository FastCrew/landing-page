'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
// All data fetching now done via API routes
import { MapPin, Clock, DollarSign, Users, Calendar } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { Profile, Job, Application } from '@/db/schema'
import { JobDetailsDialog } from '@/components/dashboard/JobDetailsDialog'

export default function BusinessDashboard() {
  const { user, isLoaded } = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateJob, setShowCreateJob] = useState(false)
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    hourlyRate: '',
    joiningBy: '',
  })
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        loadData()
      } else {
        setLoading(false)
      }
    }
  }, [user, isLoaded])

  const loadData = async () => {
    if (!user) return

    try {
      const [profileRes, jobsRes, applicationsRes] = await Promise.all([
        fetch(`/api/profile`), // Changed from /api/profile/${user.id}
        fetch(`/api/jobs?businessId=${user.id}`),
        fetch(`/api/applications?businessId=${user.id}`)
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

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) return

    try {
      const response = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: jobForm.title,
          description: jobForm.description,
          location: jobForm.location,
          hourlyRate: jobForm.hourlyRate,
          joiningBy: jobForm.joiningBy,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create job')
      }

      toast({
        title: "Job created!",
        description: "Your job posting is now live.",
      })

      setShowCreateJob(false)
      setJobForm({
        title: '',
        description: '',
        location: '',
        hourlyRate: '',
        joiningBy: '',
      })
      loadData()
    } catch (error: any) {
      console.error('Error creating job:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create job. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update application')
      }

      toast({
        title: "Application updated!",
        description: `Application status changed to ${status}.`,
      })
      loadData()
    } catch (error: any) {
      console.error('Error updating application:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update application status.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Business Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your job postings and applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Active Jobs</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {jobs.filter(job => job.status === 'open').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {applications.filter(app => app.status === 'applied').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {applications.filter(app => app.status === 'accepted').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jobs" className="w-full space-y-8">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="jobs">My Jobs</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Job Postings</h2>
              <Dialog open={showCreateJob} onOpenChange={setShowCreateJob}>
                <DialogTrigger asChild>
                  <Button size="lg" className="rounded-full px-6">Post New Job</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Job</DialogTitle>
                    <DialogDescription>
                      Fill in the details to post a new job opportunity
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateJob} className="space-y-6 mt-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title *</Label>
                        <Input
                          id="title"
                          value={jobForm.title}
                          onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Server needed for weekend"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={jobForm.location}
                          onChange={(e) => setJobForm(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="City, Area"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Job Description *</Label>
                      <Textarea
                        id="description"
                        value={jobForm.description}
                        onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the role, requirements, and any special instructions..."
                        rows={4}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate">Hourly Rate *</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                          <Input
                            id="hourlyRate"
                            type="number"
                            step="0.01"
                            className="pl-7"
                            value={jobForm.hourlyRate}
                            onChange={(e) => setJobForm(prev => ({ ...prev, hourlyRate: e.target.value }))}
                            placeholder="25.00"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="joiningBy">Joining By (Optional)</Label>
                        <Input
                          id="joiningBy"
                          type="date"
                          value={jobForm.joiningBy}
                          onChange={(e) => setJobForm(prev => ({ ...prev, joiningBy: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-12 text-base">
                      Post Job
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {jobs.map((job) => {
                const jobApplications = applications.filter(app => app.jobId === job.id)
                return (
                  <Card
                    key={job.id}
                    className="transition-all hover:shadow-md cursor-pointer hover:border-primary/50"
                    onClick={() => {
                      setSelectedJob(job)
                      setIsJobDetailsOpen(true)
                    }}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="h-4 w-4" />
                              ${job.hourlyRate.toString()}/hr
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {job.joiningBy ? `Joining by: ${new Date(job.joiningBy).toLocaleDateString()}` : 'Immediate joining'}
                            </div>
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                            {job.status}
                          </Badge>
                          <Badge variant="outline">
                            {jobApplications.length} applicants
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>
                  Review and manage job applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((application) => {
                    const job = jobs.find(j => j.id === application.jobId)
                    return (
                      <Card key={application.id} className="p-0 shadow-none border-0 bg-transparent">
                        <div className="p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{job?.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Applied on {new Date(application.createdAt).toLocaleDateString()}
                              </p>
                              {application.coverNote && (
                                <div className="mt-3 p-4 bg-muted/50 rounded-xl text-sm leading-relaxed">
                                  {application.coverNote}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-3">
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
                              {application.status === 'applied' && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8"
                                    onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                  >
                                    Reject
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="h-8"
                                    onClick={() => updateApplicationStatus(application.id, 'accepted')}
                                  >
                                    Accept
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
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

      {
        selectedJob && (
          <JobDetailsDialog
            job={selectedJob}
            open={isJobDetailsOpen}
            onOpenChange={setIsJobDetailsOpen}
            onUpdate={(updatedJob) => {
              setSelectedJob(updatedJob)
              loadData()
            }}
            onDelete={() => {
              setSelectedJob(null)
              setIsJobDetailsOpen(false)
              loadData()
            }}
          />
        )
      }
    </div >
  )
}