"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionContainer } from "@/components/shared/SectionContainer";
import { Store, ChefHat, Phone, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    icon: Store,
    role: "E-Commerce Owner",
    quote: "Hired a dev in 2 hours. Project done in a week. Incredible!",
    author: "Sarah K.",
  },
  {
    icon: ChefHat,
    role: "Chef & Caterer",
    quote: "Found catering gigs that fit my schedule. Game changer.",
    author: "Marco L.",
  },
  {
    icon: Phone,
    role: "Marketing Agency",
    quote: "We scale our team up and down based on client demand. Perfect.",
    author: "Priya S.",
  },
];

export function TestimonialsSection() {
  return (
    <SectionContainer id="testimonials" className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl -z-10" />

      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Loved by Thousands</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See what our community has to say about their experience.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <Card className="h-full border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:shadow-xl">
              <CardContent className="pt-8 relative">
                <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <testimonial.icon className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="secondary" className="mb-4 bg-secondary/50 backdrop-blur-sm">
                  {testimonial.role}
                </Badge>
                <blockquote className="text-lg font-medium leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary opacity-80" />
                  <p className="text-sm font-semibold text-foreground">— {testimonial.author}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}
