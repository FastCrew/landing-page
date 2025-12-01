"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Header } from "./Header";

interface BusinessHeaderProps {
    userProfile?: {
        name?: string;
        email?: string;
        imageUrl?: string;
    };
}

export function BusinessHeader({ userProfile }: BusinessHeaderProps) {
    const { signOut } = useClerk();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <Header
            isLoggedIn={true}
            role="business"
            userProfile={userProfile}
            onLogout={handleLogout}
        />
    );
}
