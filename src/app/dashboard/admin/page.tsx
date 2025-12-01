'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { UserButton } from '@/components/user-button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// All data fetching now done via API routes
import { Users, UserCheck, Clock, BarChart3, Search } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { Profile } from '@/db/schema'
import { Input } from '@/components/ui/input'


export default function AdminDashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingBusinesses, setPendingBusinesses] = useState<Profile[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (isLoaded && user) {
      loadData()
    } else if (isLoaded && !user) {
      // User is not logged in, redirect to sign in
      router.push('/sign-in')
    }
  }, [isLoaded, user])

  const loadData = async () => {
    if (!user) return

    console.log('Loading admin data for user:', user.id)

    try {
      console.log('Fetching profile from:', `/api/profile/${user.id}`)
      console.log('Fetching profiles from:', '/api/profiles')

      const [profileRes, profilesRes] = await Promise.all([
        fetch(`/api/profile/${user.id}`),
        fetch('/api/profiles')
      ])

      console.log('Profile response status:', profileRes.status)
      console.log('Profiles response status:', profilesRes.status)

      if (!profileRes.ok) {
        const errorText = await profileRes.text()
        console.error('Profile fetch failed:', profileRes.status, errorText)

        // If profile not found, redirect to onboarding
        if (profileRes.status === 404) {
          console.log('Profile not found, redirecting to onboarding')
          router.push('/onboarding')
          return
        }

        throw new Error(`Failed to fetch profile: ${profileRes.status} - ${errorText}`)
      }

      if (!profilesRes.ok) {
        const errorText = await profilesRes.text()
        console.error('Profiles fetch failed:', profilesRes.status, errorText)
        throw new Error(`Failed to fetch profiles: ${profilesRes.status} - ${errorText}`)
      }

      const [{ profile: profileData }, { profiles: allProfiles }] = await Promise.all([
        profileRes.json(),
        profilesRes.json()
      ])

      console.log('Profile data:', profileData)
      console.log('All profiles count:', allProfiles.length)

      setProfile(profileData)
      setProfiles(allProfiles)
      setPendingBusinesses(allProfiles.filter((p: Profile) =>
        p.role === 'worker' && p.companyName // Workers who requested business role
      ))
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load admin data",
        variant: "destructive",
      })
    } finally {
      console.log('Setting loading to false')
      setLoading(false)
    }
  }

  const handleApproveBusiness = async (userId: string) => {
    try {
      const response = await fetch(`/api/profile/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'business' }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to approve business role')
      }

      toast({
        title: "Business role approved!",
        description: "User has been granted business access.",
      })
      loadData()
    } catch (error: any) {
      console.error('Error approving business role:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to approve business role.",
        variant: "destructive",
      })
    }
  }

  const handleRejectBusiness = async (userId: string) => {
    try {
      const response = await fetch(`/api/profile/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'worker' }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to reject business role')
      }

      toast({
        title: "Business role request rejected",
        description: "Request has been declined.",
      })
      loadData()
    } catch (error: any) {
      console.error('Error rejecting business role:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to reject business role.",
        variant: "destructive",
      })
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/profile/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update user role')
      }

      toast({
        title: "Role updated!",
        description: `User role changed to ${newRole}.`,
      })
      loadData()
    } catch (error: any) {
      console.error('Error updating user role:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update user role.",
        variant: "destructive",
      })
    }
  }

  const filteredProfiles = profiles.filter(profile =>
    profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div>Loading...</div>
  }

  if (profile?.role !== 'admin') {
    return (
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Fastcrew Admin</h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserButton />
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You need administrator privileges to access this dashboard.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserButton />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* 1. Administrators */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => router.push('/dashboard/admin/admins')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profiles.filter(p => p.role === 'admin').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Click to view all admins</p>
            </CardContent>
          </Card>

          {/* 2. Workers */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => router.push('/dashboard/admin/workers')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workers</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profiles.filter(p => p.role === 'worker').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Click to view all workers</p>
            </CardContent>
          </Card>

          {/* 3. Businesses */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => router.push('/dashboard/admin/businesses')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Businesses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profiles.filter(p => p.role === 'business').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Click to view all businesses</p>
            </CardContent>
          </Card>

          {/* 4. Business Requests */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => router.push('/dashboard/admin/requests')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Business Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBusinesses.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Click to view requests</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user roles and access
                </CardDescription>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  Total Users: <span className="font-medium text-foreground">{profiles.length}</span>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No users found matching "{searchQuery}"
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>{profile.name}</TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            profile.role === 'admin' ? 'default' :
                              profile.role === 'business' ? 'secondary' :
                                'outline'
                          }
                        >
                          {profile.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {profile.role !== 'worker' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateUserRole(profile.id, 'worker')}
                            >
                              Make Worker
                            </Button>
                          )}
                          {profile.role !== 'business' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateUserRole(profile.id, 'business')}
                            >
                              Make Business
                            </Button>
                          )}
                          {profile.role !== 'admin' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateUserRole(profile.id, 'admin')}
                            >
                              Make Admin
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}