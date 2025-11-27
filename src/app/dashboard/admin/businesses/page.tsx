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
import { ArrowLeft, Briefcase, Mail, Phone, MapPin, Calendar, Building2, Search } from 'lucide-react'

export default function BusinessesPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [businesses, setBusinesses] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedBusiness, setSelectedBusiness] = useState<Profile | null>(null)
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

            // Filter only business profiles
            const businessProfiles = allProfiles.filter((p: Profile) => p.role === 'business')
            setBusinesses(businessProfiles)
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

    const handleBusinessClick = (business: Profile) => {
        setSelectedBusiness(business)
        setDialogOpen(true)
    }

    const filteredBusinesses = businesses.filter(business =>
    (business.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.companyName?.toLowerCase().includes(searchQuery.toLowerCase()))
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
                            <h1 className="text-3xl font-bold">Businesses</h1>
                            <p className="text-muted-foreground">View and manage all registered businesses</p>
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
                            <Building2 className="h-5 w-5" />
                            Total Businesses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{businesses.length}</div>
                    </CardContent>
                </Card>

                {/* Search Bar */}
                <div className="flex justify-end mb-6">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                        <Input
                            placeholder="Search businesses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Business Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBusinesses.map((business) => (
                        <Card
                            key={business.id}
                            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                            onClick={() => handleBusinessClick(business)}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="flex items-center gap-2">
                                            {business.companyName || business.name || 'Unnamed Business'}
                                            <Badge variant="secondary" className="ml-2">
                                                <Briefcase className="h-3 w-3 mr-1" />
                                                Business
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription className="mt-2 flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            {business.email}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {business.city && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {business.city}
                                        </div>
                                    )}
                                    {business.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            {business.phone}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Joined {new Date(business.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredBusinesses.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground">
                                {businesses.length === 0 ? "No businesses found" : `No businesses found matching "${searchQuery}"`}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Business Details Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Business Details
                            </DialogTitle>
                            <DialogDescription>
                                Complete information about this business
                            </DialogDescription>
                        </DialogHeader>

                        {selectedBusiness && (
                            <div className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Contact Name</label>
                                        <p className="text-lg font-semibold">{selectedBusiness.name || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                                        <p className="text-lg font-semibold">{selectedBusiness.companyName || 'Not provided'}</p>
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
                                            <p className="text-base">{selectedBusiness.email}</p>
                                        </div>
                                        {selectedBusiness.phone && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                                <p className="text-base">{selectedBusiness.phone}</p>
                                            </div>
                                        )}
                                        {selectedBusiness.city && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">City</label>
                                                <p className="text-base">{selectedBusiness.city}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Business Specifics */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Briefcase className="h-4 w-4" />
                                        Business Details
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3 pl-6">
                                        {selectedBusiness.companyVat && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">GSTIN / VAT</label>
                                                <p className="text-base font-mono">{selectedBusiness.companyVat}</p>
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
                                                {selectedBusiness.id.substring(0, 20)}...
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Joined</label>
                                            <p className="text-base">
                                                {new Date(selectedBusiness.createdAt).toLocaleString()}
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
