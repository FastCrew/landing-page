"use client";

import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";
import { Toast } from "@/components/shared/Toast";
import { useToast } from "@/lib/hooks/useToast";

export default function Page() {
  const { toast, showToast } = useToast();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  const handleAction = (
    type: "hire" | "work" | "signup" | "login" | "sales"
  ) => {
    if (type === "signup") {
      router.push("/sign-up");
      return;
    }
    if (type === "login") {
      router.push("/sign-in");
      return;
    }

    // Handle "Hire Talent" and "Find Work" buttons
    if (type === "hire" || type === "work") {
      if (!isLoaded) return; // Wait for auth to load

      if (isSignedIn) {
        // User is logged in, redirect to onboarding or dashboard
        router.push("/onboarding");
      } else {
        // User is not logged in, redirect to sign-up
        router.push("/sign-up");
      }
      return;
    }

    // Handle sales contact
    if (type === "sales") {
      showToast("Connecting you with our sales team...", "info");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onSignup={() => handleAction("signup")}
        onLogin={() => handleAction("login")}
      />

      <main className="flex-1">
        <HeroSection
          onHireClick={() => handleAction("hire")}
          onWorkClick={() => handleAction("work")}
        />
        <FeaturesSection />
        <PricingSection onSalesClick={() => handleAction("sales")} />
        <TestimonialsSection />
        <CTASection onSignup={() => handleAction("signup")} />
      </main>

      <Footer />

      <AnimatePresence>
        {toast && <Toast msg={toast.msg} tone={toast.tone} />}
      </AnimatePresence>
    </div>
  );
}