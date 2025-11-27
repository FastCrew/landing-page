"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionContainer } from "@/components/shared/SectionContainer";
import { Rocket, ShieldCheck, Gauge } from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Lightning Fast",
    description: "Post a job and get proposals within minutes from verified professionals.",
  },
  {
    icon: ShieldCheck,
    title: "100% Secure",
    description: "Escrow payments, encrypted data, and dispute resolution built in.",
  },
  {
    icon: Gauge,
    title: "Real-Time Dashboard",
    description: "Track progress, manage contracts, and communicate seamlessly.",
  },
];

export function FeaturesSection() {
  return (
    <SectionContainer id="features" className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Why Choose FastCrew?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to succeed in the gig economy, built for speed and security.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <Card className="h-full border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}
