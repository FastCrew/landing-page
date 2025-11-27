import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, DollarSign, Trash2, FileText, Calendar, Building } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import type { Application, Job } from '@/db/schema'

interface ApplicationDetailsDialogProps {
    application: Application
    job: Job | undefined
    open: boolean
    onOpenChange: (open: boolean) => void
    onDelete: () => void
}

export function ApplicationDetailsDialog({ application, job, open, onOpenChange, onDelete }: ApplicationDetailsDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) return
        setIsLoading(true)
        try {
            const response = await fetch(`/api/applications/${application.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Failed to delete application')

            toast({ title: 'Success', description: 'Application deleted successfully' })
            onDelete()
            onOpenChange(false)
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete application', variant: 'destructive' })
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'default'
            case 'rejected':
                return 'destructive'
            case 'reviewed':
                return 'secondary'
            default:
                return 'outline'
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex justify-between items-start pr-8">
                        <DialogTitle className="text-2xl font-bold">
                            Application Details
                        </DialogTitle>
                        <Badge variant={getStatusColor(application.status)} className="px-3 py-1">
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                    </div>
                    <DialogDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Applied on {new Date(application.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    {/* Job Information */}
                    {job && (
                        <div className="space-y-4">
                            <div className="border-b pb-4">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <Building className="h-5 w-5 text-primary" />
                                    Job Information
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-xl font-bold text-foreground">{job.title}</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-4 w-4" />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <DollarSign className="h-4 w-4" />
                                            <span>${job.hourlyRate.toString()}/hr</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                {job.joiningBy
                                                    ? `Joining by: ${new Date(job.joiningBy).toLocaleDateString()}`
                                                    : 'Immediate joining'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Job Description</p>
                                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
                                            {job.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Application Details */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Your Application
                                </h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground mb-1">Application Status</p>
                                            <Badge variant={getStatusColor(application.status)} className="px-3 py-1">
                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Submitted Date</p>
                                            <p className="font-medium">
                                                {new Date(application.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {application.coverNote && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-muted-foreground mb-2">Cover Note</p>
                                            <div className="bg-muted/50 p-4 rounded-lg">
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                    {application.coverNote}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {!job && (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>Job information not available</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between items-center mt-8 gap-4 sm:justify-between">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Application
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
