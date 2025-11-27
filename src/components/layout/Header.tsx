"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onSignup: () => void;
  onLogin: () => void;
}

export function Header({ onSignup, onLogin }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#testimonials", label: "Testimonials" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 border-b border-transparent",
        scrolled
          ? "bg-white/70 dark:bg-black/70 backdrop-blur-xl border-border/40 shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20 xl:px-28 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <span className="bg-primary text-primary-foreground w-8 h-8 rounded-lg flex items-center justify-center font-bold">F</span>
          <span>Fastcrew</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex gap-1">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50"
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" onClick={onLogin} className="text-muted-foreground hover:text-foreground">
            Log In
          </Button>
          <Button onClick={onSignup} className="shadow-none">Sign Up</Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[300px] sm:w-[400px] glass border-l border-white/20">
            <SheetHeader className="mb-8 text-left">
              <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-lg flex items-center justify-center text-base">F</span>
                Fastcrew
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col justify-between h-[calc(100vh-120px)]">
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-2 px-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-3 px-4 rounded-xl hover:bg-secondary/50"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-3 pt-6 border-t border-border/50 px-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setOpen(false);
                    onLogin();
                  }}
                  className="w-full justify-center"
                >
                  Log In
                </Button>
                <Button
                  size="lg"
                  onClick={() => {
                    setOpen(false);
                    onSignup();
                  }}
                  className="w-full justify-center"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
