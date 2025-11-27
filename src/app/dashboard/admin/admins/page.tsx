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
import { toast } from '@/hooks/use-toast'
import type { Profile } from '@/db/schema'
import { ArrowLeft, Shield, Mail, Phone, MapPin, Calendar } from 'lucide-react'

export default function AdminsPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [admins, setAdmins] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedAdmin, setSelectedAdmin] = useState<Profile | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    useEffect(() => {
        if (isLoaded && user) {
            loadData()
        } else if (isLoaded && !user) {
            router.push('/sign-in')
        }
    }, [isLoaded, user])

    const loadData = async () => {
        console.log('Loading admins data for user:', user!.id)

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

            // Filter only admin profiles
            const adminProfiles = allProfiles.filter((p: Profile) => p.role === 'admin')
            setAdmins(adminProfiles)
        } catch (error) {
            console.error('Error loading data:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to load admin data",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleAdminClick = (admin: Profile) => {
        setSelectedAdmin(admin)
        setDialogOpen(true)
    }

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
                            <h1 className="text-3xl font-bold">Admin Management</h1>
                            <p className="text-muted-foreground">View and manage all administrators</p>
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
                            <Shield className="h-5 w-5" />
                            Total Administrators
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{admins.length}</div>
                    </CardContent>
                </Card>

                {/* Admin Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {admins.map((admin) => (
                        <Card
                            key={admin.id}
                            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                            onClick={() => handleAdminClick(admin)}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="flex items-center gap-2">
                                            {admin.name || 'Unnamed Admin'}
                                            <Badge variant="default" className="ml-2">
                                                <Shield className="h-3 w-3 mr-1" />
                                                Admin
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription className="mt-2 flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            {admin.email}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {admin.city && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {admin.city}
                                        </div>
                                    )}
                                    {admin.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            {admin.phone}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Joined {new Date(admin.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {admins.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground">No administrators found</p>
                        </CardContent>
                    </Card>
                )}

                {/* Admin Details Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Administrator Details
                            </DialogTitle>
                            <DialogDescription>
                                Complete information about this administrator
                            </DialogDescription>
                        </DialogHeader>

                        {selectedAdmin && (
                            <div className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                                        <p className="text-lg font-semibold">{selectedAdmin.name || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Role</label>
                                        <div className="mt-1">
                                            <Badge variant="default">
                                                <Shield className="h-3 w-3 mr-1" />
                                                Administrator
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
                                            <p className="text-base">{selectedAdmin.email}</p>
                                        </div>
                                        {selectedAdmin.phone && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                                <p className="text-base">{selectedAdmin.phone}</p>
                                            </div>
                                        )}
                                        {selectedAdmin.city && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">City</label>
                                                <p className="text-base">{selectedAdmin.city}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

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
                                                {selectedAdmin.id.substring(0, 20)}...
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Created At</label>
                                            <p className="text-base">
                                                {new Date(selectedAdmin.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                                            <p className="text-base">
                                                {new Date(selectedAdmin.updatedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Info (if any) */}
                                {(selectedAdmin.companyName || selectedAdmin.companyVat) && (
                                    <div className="space-y-3">
                                        <h3 className="font-semibold">Company Information</h3>
                                        <div className="grid grid-cols-1 gap-3 pl-6">
                                            {selectedAdmin.companyName && (
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                                                    <p className="text-base">{selectedAdmin.companyName}</p>
                                                </div>
                                            )}
                                            {selectedAdmin.companyVat && (
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">GSTIN</label>
                                                    <p className="text-base">{selectedAdmin.companyVat}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

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
