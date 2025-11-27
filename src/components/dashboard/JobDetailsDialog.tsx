import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, DollarSign, Trash2, Archive, Edit2, RotateCcw } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { Job } from '@/db/schema'

interface JobDetailsDialogProps {
    job: Job
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdate: (job: Job) => void
    onDelete: () => void
}

export function JobDetailsDialog({ job, open, onOpenChange, onUpdate, onDelete }: JobDetailsDialogProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: job.title,
        description: job.description,
        location: job.location,
        hourlyRate: job.hourlyRate.toString(),
        joiningBy: job.joiningBy ? new Date(job.joiningBy).toISOString().split('T')[0] : '',
        status: job.status,
    })

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/jobs/${job.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    hourlyRate: parseFloat(formData.hourlyRate),
                }),
            })

            if (!response.ok) throw new Error('Failed to update job')

            const data = await response.json()
            toast({ title: 'Success', description: 'Job updated successfully' })
            setIsEditing(false)
            onUpdate(data.job)
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update job', variant: 'destructive' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleArchive = async () => {
        if (!confirm('Are you sure you want to archive this job? It will be closed for new applications.')) return
        setIsLoading(true)
        try {
            const response = await fetch(`/api/jobs/${job.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'closed' }),
            })

            if (!response.ok) throw new Error('Failed to archive job')

            const data = await response.json()
            toast({ title: 'Success', description: 'Job archived successfully' })
            onUpdate(data.job)
            onOpenChange(false)
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to archive job', variant: 'destructive' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleReinstate = async () => {
        if (!confirm('Are you sure you want to reinstate this job? It will be open for new applications.')) return
        setIsLoading(true)
        try {
            const response = await fetch(`/api/jobs/${job.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'open' }),
            })

            if (!response.ok) throw new Error('Failed to reinstate job')

            const data = await response.json()
            toast({ title: 'Success', description: 'Job reinstated successfully' })
            onUpdate(data.job)
            onOpenChange(false)
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to reinstate job', variant: 'destructive' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) return
        setIsLoading(true)
        try {
            const response = await fetch(`/api/jobs/${job.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Failed to delete job')

            toast({ title: 'Success', description: 'Job deleted successfully' })
            onDelete()
            onOpenChange(false)
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete job', variant: 'destructive' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex justify-between items-start pr-8">
                        <DialogTitle className="text-2xl font-bold">
                            {isEditing ? 'Edit Job' : job.title}
                        </DialogTitle>
                        {!isEditing && (
                            <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                                {job.status === 'open' ? 'Open' : 'Closed'}
                            </Badge>
                        )}
                    </div>
                    {!isEditing && (
                        <DialogDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" /> {job.location}
                            <Clock className="h-4 w-4 ml-4" /> Joining by: {job.joiningBy ? new Date(job.joiningBy).toLocaleDateString() : 'N/A'}
                            <DollarSign className="h-4 w-4 ml-4" /> {job.hourlyRate} / hr
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="py-4">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Job Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Hourly Rate ($)</Label>
                                    <Input
                                        type="number"
                                        value={formData.hourlyRate}
                                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Joining By</Label>
                                <Input
                                    type="date"
                                    value={formData.joiningBy}
                                    onChange={(e) => setFormData({ ...formData, joiningBy: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={6}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="prose dark:prose-invert max-w-none">
                                <h3 className="text-lg font-semibold mb-2">Description</h3>
                                <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                                    {job.description}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between items-center mt-8 gap-4 sm:justify-between">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="flex gap-2">
                                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isLoading}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                                {job.status === 'open' ? (
                                    <Button variant="secondary" size="sm" onClick={handleArchive} disabled={isLoading}>
                                        <Archive className="h-4 w-4 mr-2" /> Archive
                                    </Button>
                                ) : (
                                    <Button variant="secondary" size="sm" onClick={handleReinstate} disabled={isLoading}>
                                        <RotateCcw className="h-4 w-4 mr-2" /> Reinstate
                                    </Button>
                                )}
                            </div>
                            <Button onClick={() => setIsEditing(true)}>
                                <Edit2 className="h-4 w-4 mr-2" /> Edit Job
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
