// app/page.tsx
// Deps:
// - tailwindcss configured
// - shadcn/ui installed (Button, Card, Badge, Separator, NavigationMenu)
// - framer-motion: npm i framer-motion
// - lucide-react: npm i lucide-react
// - next-themes (optional if you use a theme provider)

"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Rocket, ShieldCheck, Gauge, Store, ChefHat, Phone } from "lucide-react";

export default function Page() {
  // subtle parallax for hero decorations
  const { scrollY } = useScroll();
  const floatY = useTransform(scrollY, [0, 400], [0, -20]);

  const [toast, setToast] = React.useState<{msg: string; tone: "success" | "info"} | null>(null);

  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const handleClick = (type: "hire" | "work" | "signup" | "login" | "sales") => {
    const message =
      type === "hire"
        ? "Redirecting to talent marketplace..."
        : type === "work"
        ? "Redirecting to job listings..."
        : type === "signup"
        ? "Opening registration form..."
        : type === "login"
        ? "Opening login form..."
        : "Connecting you with our sales team...";
    setToast({ msg: message, tone: type === "hire" || type === "work" ? "success" : "info" });
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header onLogin={() => handleClick("login")} onSignup={() => handleClick("signup")} />

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-900/10 dark:via-background dark:to-purple-900/10" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight"
              >
                Connecting Businesses with{" "}
                <span className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  Culinary Talent
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-6 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
              >
                The fastest way to hire skilled cooks and kitchen crews, or find your next culinary opportunity
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button size="lg" className="px-8" onClick={() => handleClick("hire")}>
                  🔍 Hire Talent
                </Button>
                <Button size="lg" variant="outline" className="px-8" onClick={() => handleClick("work")}>
                  💼 Find Work
                </Button>
              </motion.div>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-muted-foreground">
                <TrustItem label="1000+ Active Businesses" />
                <Dot />
                <TrustItem label="5000+ Skilled Professionals" />
                <Dot />
                <TrustItem label="24/7 Support" />
              </div>
            </div>
          </div>

          {/* Floating cards with subtle parallax */}
          <motion.div
            style={{ y: floatY }}
            className="hidden md:block absolute top-16 left-10"
            aria-hidden="true"
          >
            <FloatingCard
              icon={<ChefHat className="h-5 w-5 text-orange-600" />}
              title="Head Chef"
              subtitle="Available Now"
              tone="orange"
            />
          </motion.div>

          <motion.div
            style={{ y: floatY }}
            className="hidden md:block absolute top-36 right-10"
            aria-hidden="true"
          >
            <FloatingCard
              icon={<Store className="h-5 w-5 text-emerald-600" />}
              title="Restaurant Chain"
              subtitle="Hiring 50+ Cooks"
              tone="green"
              delay
            />
          </motion.div>
        </section>

        <section className="py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Why Choose FastCrew?</h2>
              <p className="mt-3 text-lg text-muted-foreground">
                We make it simple to connect talented culinary professionals with businesses that need them
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Feature
                icon={<Rocket className="h-7 w-7 text-indigo-600" />}
                title="Lightning Fast Matching"
                desc="Get matched with qualified candidates or opportunities in minutes, not days. Our AI-powered system ensures excellent fits."
              />
              <Feature
                icon={<ShieldCheck className="h-7 w-7 text-emerald-600" />}
                title="Verified Professionals"
                desc="All culinary professionals are background-checked and skill-verified. Hire with confidence every time."
              />
              <Feature
                icon={<Gauge className="h-7 w-7 text-purple-600" />}
                title="Transparent Pricing"
                desc="No hidden fees or surprises. Clear, upfront pricing that works for businesses of all sizes."
              />
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">About FastCrew</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Founded by industry veterans, FastCrew bridges the gap between talented culinary professionals and
                businesses that need them. The platform understands the unique challenges of the food service industry.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                The marketplace has facilitated over 10,000 successful placements, helping restaurants, catering
                companies, and food businesses find the right talent quickly and efficiently.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <Stat value="10K+" label="Successful Placements" />
                <Stat value="98%" label="Satisfaction Rate" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Card className="overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
                <CardHeader>
                  <div className="text-6xl">🍳</div>
                  <CardTitle className="text-2xl">Join Our Community</CardTitle>
                  <CardDescription className="text-indigo-100">
                    Connect with thousands of culinary professionals and businesses nationwide.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="secondary" onClick={() => handleClick("signup")}>
                    Get Started Today
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </section>

        <section id="pricing" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
              <p className="mt-3 text-lg text-muted-foreground">Choose the plan that works best for your business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Plan
                name="Basic"
                price="$99"
                period="/month"
                note="Perfect for small restaurants"
                features={["Up to 5 job postings", "Basic candidate screening", "Email support"]}
                cta="Get Started"
                onClick={() => handleClick("signup")}
                variant="outline"
              />

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20% 0px" }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <Card className="relative bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-0">
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900">
                    Most Popular
                  </Badge>
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Pro</CardTitle>
                    <div className="mt-1 text-4xl font-bold">
                      $299<span className="text-lg opacity-80">/month</span>
                    </div>
                    <CardDescription className="opacity-80 text-indigo-100">For growing businesses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {["Unlimited job postings", "Advanced screening & matching", "Priority support", "Analytics dashboard"].map(
                        (f) => (
                          <li key={f} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-emerald-300 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary" className="w-full" onClick={() => handleClick("signup")}>
                      Start Free Trial
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <Plan
                name="Enterprise"
                price="Custom"
                period=""
                note="For large organizations"
                features={["Everything in Pro", "Dedicated account manager", "Custom integrations", "24/7 phone support"]}
                cta="Contact Sales"
                onClick={() => handleClick("sales")}
                variant="outline"
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
            <p className="mt-3 text-xl text-indigo-100">
              Join thousands of businesses and culinary professionals who trust FastCrew
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" onClick={() => handleClick("hire")}>
                🔍 Start Hiring Today
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent text-white border-white/70 hover:bg-white hover:text-indigo-700"
                onClick={() => handleClick("work")}
              >
                💼 Find Your Next Job
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Inline toast */}
      <div className="pointer-events-none fixed top-4 right-4 z-50 space-y-2">
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className={`pointer-events-auto rounded-md px-4 py-3 shadow-lg ${
              toast.tone === "success" ? "bg-emerald-600 text-white" : "bg-indigo-600 text-white"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Header(props: { onLogin: () => void; onSignup: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-black tracking-widest text-xl md:text-2xl [font-family:Orbitron,system-ui,sans-serif] bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          FASTCREW
        </Link>

        <nav className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="#about" legacyBehavior passHref>
                  <NavigationMenuLink className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#pricing" legacyBehavior passHref>
                  <NavigationMenuLink className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={props.onLogin}>
            Login
          </Button>
          <Button onClick={props.onSignup}>Sign Up</Button>
        </div>
      </div>
    </header>
  );
}

function TrustItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <Check className="h-3.5 w-3.5" />
      </span>
      <span className="text-sm md:text-base">{label}</span>
    </div>
  );
}

function Dot() {
  return <span className="hidden sm:block h-1 w-1 rounded-full bg-muted-foreground/40" />;
}

function FloatingCard({
  icon,
  title,
  subtitle,
  tone,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tone: "orange" | "green";
  delay?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{ duration: 6, delay: delay ? 0.8 : 0, repeat: Infinity, ease: "easeInOut" }}
      className="rounded-xl bg-white shadow-lg ring-1 ring-black/5 p-4 w-64"
    >
      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center ${
            tone === "orange" ? "bg-orange-100" : "bg-emerald-100"
          }`}
        >
          {icon}
        </div>
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20% 0px" }}
      transition={{ duration: 0.4 }}
    >
      <Card className="h-full hover:shadow-xl transition-shadow">
        <CardHeader className="flex-row items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center">{icon}</div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-muted-foreground">{desc}</CardContent>
      </Card>
    </motion.div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}

function Plan({
  name,
  price,
  period,
  note,
  features,
  cta,
  onClick,
  variant = "default",
}: {
  name: string;
  price: string;
  period: string;
  note: string;
  features: string[];
  cta: string;
  onClick: () => void;
  variant?: "default" | "outline";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20% 0px" }}
      transition={{ duration: 0.4 }}
    >
      <Card className="h-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{name}</CardTitle>
          <div className="mt-1 text-4xl font-bold text-foreground">
            {price}
            {period && <span className="text-lg text-muted-foreground">{period}</span>}
          </div>
          <CardDescription>{note}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-emerald-600 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant={variant === "outline" ? "outline" : "default"} onClick={onClick}>
            {cta}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="font-black tracking-widest text-2xl [font-family:Orbitron,system-ui,sans-serif] bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            FASTCREW
          </div>
          <p className="mt-3 text-muted-foreground max-w-md">
            Connecting businesses with culinary talent across the nation. Fast, reliable, and trusted by thousands.
          </p>
          <div className="mt-4 flex gap-3 text-muted-foreground">
            <Social icon={<TwitterIcon />} />
            <Social icon={<XIcon />} />
            <Social icon={<LinkedInIcon />} />
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">For Businesses</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><FooterLink href="#">Post Jobs</FooterLink></li>
            <li><FooterLink href="#">Browse Talent</FooterLink></li>
            <li><FooterLink href="#pricing">Pricing</FooterLink></li>
            <li><FooterLink href="#">Success Stories</FooterLink></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">For Professionals</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><FooterLink href="#">Find Jobs</FooterLink></li>
            <li><FooterLink href="#">Create Profile</FooterLink></li>
            <li><FooterLink href="#">Career Resources</FooterLink></li>
            <li><FooterLink href="#">Support</FooterLink></li>
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <Separator />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between pt-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FastCrew. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>24/7 phone support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="hover:text-foreground transition-colors">
      {children}
    </Link>
  );
}

function Social({ icon }: { icon: React.ReactNode }) {
  return (
    <button
      aria-label="social"
      className="h-9 w-9 inline-flex items-center justify-center rounded-md border bg-background hover:bg-muted transition-colors"
    >
      {icon}
    </button>
  );
}

/* Lightweight SVG icons for footer social */
function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M24 4.6c-.9.4-1.8.6-2.8.8 1-0.6 1.8-1.6 2.1-2.7-1 .6-2.1 1-3.2 1.2C19 2.9 17.7 2.3 16.3 2.3c-2.7 0-4.9 2.3-4.9 5 0 .4 0 .7.1 1.1C7.5 8.2 4 6.5 1.6 3.9c-.4.7-.6 1.5-.6 2.3 0 1.7.8 3.2 2.1 4.1-.7 0-1.4-.2-2-.5v.1c0 2.4 1.7 4.4 3.9 4.9-.4.1-.9.2-1.4.2-.3 0-.7 0-1-.1.7 2.1 2.7 3.6 5 3.7-1.9 1.5-4.3 2.3-6.9 2 .2.1 3.4 2 7.5 2 9.1 0 14.2-7.6 14.2-14.2v-.6c1-.7 1.8-1.5 2.4-2.5z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M18.2 2H22l-8.6 9.8L22.6 22h-7.5l-5.9-7.3L2.2 22H0l9.4-10.7L.2 2h7.6l5.4 6.8L18.2 2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43c-1.14 0-2.06-.93-2.06-2.06s.92-2.06 2.06-2.06 2.06.93 2.06 2.06-.93 2.06-2.06 2.06zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.2 0 22.23 0z" />
    </svg>
  );
}

