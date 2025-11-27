"use client";

import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/shared/SectionContainer";
import { motion } from "framer-motion";

interface CTASectionProps {
  onSignup: () => void;
}

export function CTASection({ onSignup }: CTASectionProps) {
  return (
    <SectionContainer className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals and businesses already using FastCrew to connect and grow.
          </p>
          <Button size="lg" onClick={onSignup} className="h-14 px-10 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Create Your Free Account
          </Button>
        </div>
      </motion.div>
    </SectionContainer>
  );
}
