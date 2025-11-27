"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionContainer } from "@/components/shared/SectionContainer";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    price: "₹0",
    description: "Perfect for trying out the platform",
    features: [
      "5% commission on jobs",
      "Basic support",
      "Standard verification",
      "Community access",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "₹199",
    description: "Best for freelancers and small teams",
    features: [
      "2% commission on jobs",
      "Priority support",
      "Enhanced profile",
      "Advanced analytics",
      "Custom proposals",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Negotiable commission",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
      "SLA guarantee",
    ],
    popular: false,
  },
];

interface PricingSectionProps {
  onSalesClick: () => void;
}

export function PricingSection({ onSalesClick }: PricingSectionProps) {
  return (
    <SectionContainer id="pricing" className="relative">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Simple, Transparent Pricing</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your needs. No hidden fees.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <Card
              className={`relative h-full flex flex-col border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${plan.popular
                  ? "border-primary/50 shadow-primary/10 ring-1 ring-primary/20"
                  : ""
                }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-sm font-medium shadow-lg">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground ml-1">/month</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="mt-1 rounded-full bg-primary/10 p-1">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full h-12 text-base"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={onSalesClick}
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}
