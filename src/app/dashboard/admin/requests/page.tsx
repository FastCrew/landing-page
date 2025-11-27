'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Construction } from 'lucide-react'

export default function BusinessRequestsPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col">
            <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/dashboard/admin')}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="bg-background p-8 rounded-full shadow-lg mb-6">
                        <Construction className="h-16 w-16 text-primary animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Dev in Progress</h1>
                    <p className="text-xl text-muted-foreground max-w-md">
                        This feature is currently under development. Please check back later.
                    </p>
                </div>
            </div>
        </div>
    )
}
