'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { UserButton } from '@/components/user-button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import type { Profile } from '@/db/schema'
import { ArrowLeft, UserCheck, Mail, Phone, MapPin, Calendar, Wrench, Search } from 'lucide-react'

export default function WorkersPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [workers, setWorkers] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedWorker, setSelectedWorker] = useState<Profile | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (isLoaded && user) {
            loadData()
        } else if (isLoaded && !user) {
            router.push('/sign-in')
        }
    }, [isLoaded, user])

    const loadData = async () => {
        try {
            const [profileRes, profilesRes] = await Promise.all([
                fetch(`/api/profile/${user!.id}`),
                fetch('/api/profiles')
            ])

            if (!profileRes.ok) {
                if (profileRes.status === 404) {
                    router.push('/onboarding')
                    return
                }
                throw new Error('Failed to fetch profile')
            }

            if (!profilesRes.ok) {
                throw new Error('Failed to fetch profiles')
            }

            const [{ profile: profileData }, { profiles: allProfiles }] = await Promise.all([
                profileRes.json(),
                profilesRes.json()
            ])

            setProfile(profileData)

            // Filter only worker profiles
            const workerProfiles = allProfiles.filter((p: Profile) => p.role === 'worker')
            setWorkers(workerProfiles)
        } catch (error) {
            console.error('Error loading data:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to load data",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleWorkerClick = (worker: Profile) => {
        setSelectedWorker(worker)
        setDialogOpen(true)
    }

    const filteredWorkers = workers.filter(worker =>
        worker.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>
    }

    if (profile?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
                <div className="container mx-auto px-4 py-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Access Denied</CardTitle>
                            <CardDescription>
                                You need administrator privileges to access this page.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/dashboard/admin')}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Workers</h1>
                            <p className="text-muted-foreground">View and manage all registered workers</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <UserButton />
                    </div>
                </div>

                {/* Stats */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5" />
                            Total Workers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{filteredWorkers.length}</div>
                    </CardContent>
                </Card>

                {/* Search Bar */}
                <div className="flex justify-end mb-6">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                        <Input
                            placeholder="Search workers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Worker Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkers.map((worker) => (
                        <Card
                            key={worker.id}
                            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                            onClick={() => handleWorkerClick(worker)}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="flex items-center gap-2">
                                            {worker.name || 'Unnamed Worker'}
                                            <Badge variant="outline" className="ml-2">
                                                <UserCheck className="h-3 w-3 mr-1" />
                                                Worker
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription className="mt-2 flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            {worker.email}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {worker.city && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {worker.city}
                                        </div>
                                    )}
                                    {worker.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            {worker.phone}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Joined {new Date(worker.createdAt).toLocaleDateString()}
                                    </div>
                                    {worker.skills && Array.isArray(worker.skills) && worker.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {worker.skills.slice(0, 3).map((skill, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {worker.skills.length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{worker.skills.length - 3} more
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredWorkers.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <UserCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground">
                                {workers.length === 0 ? "No workers found" : `No workers found matching "${searchQuery}"`}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Worker Details Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5" />
                                Worker Details
                            </DialogTitle>
                            <DialogDescription>
                                Complete information about this worker
                            </DialogDescription>
                        </DialogHeader>

                        {selectedWorker && (
                            <div className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                                        <p className="text-lg font-semibold">{selectedWorker.name || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Role</label>
                                        <div className="mt-1">
                                            <Badge variant="outline">
                                                <UserCheck className="h-3 w-3 mr-1" />
                                                Worker
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Contact Information
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3 pl-6">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                                            <p className="text-base">{selectedWorker.email}</p>
                                        </div>
                                        {selectedWorker.phone && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                                <p className="text-base">{selectedWorker.phone}</p>
                                            </div>
                                        )}
                                        {selectedWorker.city && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">City</label>
                                                <p className="text-base">{selectedWorker.city}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Skills */}
                                {selectedWorker.skills && Array.isArray(selectedWorker.skills) && selectedWorker.skills.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Wrench className="h-4 w-4" />
                                            Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2 pl-6">
                                            {selectedWorker.skills.map((skill, i) => (
                                                <Badge key={i} variant="secondary">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Account Info */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Account Information
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3 pl-6">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">User ID</label>
                                            <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                                {selectedWorker.id.substring(0, 20)}...
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Joined</label>
                                            <p className="text-base">
                                                {new Date(selectedWorker.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4 border-t">
                                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
