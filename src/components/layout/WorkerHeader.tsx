"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Header } from "./Header";

interface WorkerHeaderProps {
    userProfile?: {
        name?: string;
        email?: string;
        imageUrl?: string;
    };
}

export function WorkerHeader({ userProfile }: WorkerHeaderProps) {
    const { signOut } = useClerk();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <Header
            isLoggedIn={true}
            role="worker"
            userProfile={userProfile}
            onLogout={handleLogout}
        />
    );
}
