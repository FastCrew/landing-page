import { currentUser } from "@clerk/nextjs/server";
import { WorkerHeader } from "@/components/layout/WorkerHeader";
import { Footer } from "@/components/layout/Footer";

export default async function WorkerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    const userProfile = user
        ? {
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || undefined,
            email: user.emailAddresses[0]?.emailAddress,
            imageUrl: user.imageUrl,
        }
        : undefined;

    return (
        <div className="min-h-screen flex flex-col">
            <WorkerHeader userProfile={userProfile} />
            <main className="flex-1 bg-background">{children}</main>
            <Footer />
        </div>
    );
}
