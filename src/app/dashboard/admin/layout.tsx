import { Footer } from "@/components/layout/Footer";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 bg-gradient-to-br from-primary/5 via-background to-secondary/5">{children}</main>
            <Footer />
        </div>
    );
}
