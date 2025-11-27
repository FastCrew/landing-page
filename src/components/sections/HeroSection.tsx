"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionContainer } from "@/components/shared/SectionContainer";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onHireClick: () => void;
  onWorkClick: () => void;
}

export function HeroSection({ onHireClick, onWorkClick }: HeroSectionProps) {
  const { scrollY } = useScroll();
  const floatY = useTransform(scrollY, [0, 400], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <SectionContainer className="relative overflow-hidden pt-16 pb-16 min-h-[calc(100vh-80px)] flex items-center">
      {/* Background decoration */}
      <motion.div
        style={{ y: floatY, opacity }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-100/40 via-purple-100/40 to-transparent rounded-[100%] blur-3xl pointer-events-none -z-10"
      />

      <div className="relative text-center space-y-8 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium bg-white/50 backdrop-blur-sm border-white/20 shadow-sm">
            🚀 Now live in India
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-balance text-foreground"
        >
          The Future of{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">
            Flexible Work
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed"
        >
          Connect with top-tier talent or find your next gig. Fast, secure, and
          built for the modern workforce.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <Button size="lg" onClick={onHireClick} className="text-base px-8 h-14 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
            Hire Talent <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onWorkClick}
            className="text-base px-8 h-14 rounded-full bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/80"
          >
            Find Work
          </Button>
        </motion.div>
      </div>
    </SectionContainer>
  );
}
