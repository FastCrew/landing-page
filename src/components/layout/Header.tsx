"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, MessageCircle, Search, ChevronDown, LogOut, Settings, HelpCircle, LayoutDashboard, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onSignup?: () => void;
  onLogin?: () => void;
  isLoggedIn?: boolean;
  role?: "worker" | "business" | "admin";
  userProfile?: {
    name?: string;
    email?: string;
    imageUrl?: string;
  };
  onLogout?: () => void;
}

export function Header({
  onSignup,
  onLogin,
  isLoggedIn = false,
  role = "worker",
  userProfile,
  onLogout
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Get user's first initial for avatar fallback
  const getUserInitial = () => {
    if (userProfile?.name) {
      return userProfile.name.charAt(0).toUpperCase();
    }
    if (userProfile?.email) {
      return userProfile.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Determine which logo to show based on theme
  const getLogoSrc = () => {
    if (!mounted) return "/logo-light.svg"; // Default during SSR

    // For logged-in users (worker/business), always use dark logo since navbar is black
    if (isLoggedIn && (role === "worker" || role === "business")) {
      return "/logo-dark.svg";
    }

    // For non-logged-in users, use theme-based logo
    const currentTheme = resolvedTheme || theme;
    return currentTheme === "dark" ? "/logo-dark.svg" : "/logo-light.svg";
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 border-b",
        isLoggedIn && (role === "worker" || role === "business")
          ? "bg-black border-white/10"
          : scrolled
            ? "bg-white/70 dark:bg-black/70 backdrop-blur-xl border-border/40 shadow-sm"
            : "bg-transparent border-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20 xl:px-28 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          {mounted && (
            <Image
              src={getLogoSrc()}
              alt="Fastcrew"
              width={128}
              height={30}
              priority
              className="h-7 w-auto"
            />
          )}
        </Link>

        {/* Authenticated Worker View - Desktop */}
        {isLoggedIn && role === "worker" ? (
          <>
            {/* Dashboard, Jobs Link and Search Bar */}
            <div className="hidden md:flex items-center gap-4 flex-1 ml-8">
              <Link
                href="/dashboard/worker"
                className="text-sm font-medium text-white hover:text-white/80 transition-colors px-3"
              >
                Dashboard
              </Link>
              <Link
                href="/jobs"
                className="text-sm font-medium text-white hover:text-white/80 transition-colors px-3"
              >
                Jobs
              </Link>
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search jobs..."
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-white/30"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Messages Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80 hover:bg-white/10"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>

              {/* User Profile Dropdown */}
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                      {userProfile?.imageUrl ? (
                        <img
                          src={userProfile.imageUrl}
                          alt={userProfile.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getUserInitial()
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 text-white" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-gray-900 border-gray-700 text-white"
                >
                  <DropdownMenuItem className="focus:bg-gray-800 focus:text-white cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 focus:text-white cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 focus:text-white cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help Center</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="focus:bg-gray-800 focus:text-white cursor-pointer text-red-400 focus:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : isLoggedIn && role === "business" ? (
          <>
            {/* Jobs Link and Dashboard Link */}
            <div className="hidden md:flex items-center gap-4 flex-1 ml-8">
              <Link
                href="/dashboard/business"
                className="text-sm font-medium text-white hover:text-white/80 transition-colors px-3"
              >
                Dashboard
              </Link>
              <Link
                href="/jobs"
                className="text-sm font-medium text-white hover:text-white/80 transition-colors px-3"
              >
                Jobs
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Messages Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80 hover:bg-white/10"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>

              {/* User Profile Dropdown */}
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                      {userProfile?.imageUrl ? (
                        <img
                          src={userProfile.imageUrl}
                          alt={userProfile.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getUserInitial()
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 text-white" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-gray-900 border-gray-700 text-white"
                >
                  <DropdownMenuItem className="focus:bg-gray-800 focus:text-white cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 focus:text-white cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-gray-800 focus:text-white cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help Center</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="focus:bg-gray-800 focus:text-white cursor-pointer text-red-400 focus:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : (
          <>
            {/* Default Unauthenticated View - Desktop Navigation */}
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
          </>
        )}

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "md:hidden",
                isLoggedIn && (role === "worker" || role === "business") ? "text-white hover:text-white/80" : ""
              )}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[300px] sm:w-[400px] glass border-l border-white/20">
            <SheetHeader className="mb-8 text-left">
              <SheetTitle className="flex items-center">
                {mounted && (
                  <Image
                    src={getLogoSrc()}
                    alt="Fastcrew"
                    width={128}
                    height={30}
                    className="h-7 w-auto"
                  />
                )}
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col justify-between h-[calc(100vh-120px)]">
              {isLoggedIn && role === "worker" ? (
                <>
                  {/* Mobile Authenticated Worker View */}
                  <nav className="flex flex-col gap-4 px-2">
                    <Link
                      href="/dashboard/worker"
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium text-foreground py-3 px-4 rounded-xl hover:bg-secondary/50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/jobs"
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium text-foreground py-3 px-4 rounded-xl hover:bg-secondary/50"
                    >
                      Jobs
                    </Link>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search jobs..."
                        className="pl-10"
                      />
                    </div>
                  </nav>

                  {/* Mobile User Actions */}
                  <div className="flex flex-col gap-3 pt-6 border-t border-border/50 px-2">
                    <Button variant="outline" size="lg" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help Center
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={onLogout}
                      className="w-full justify-start text-red-500 hover:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </Button>
                  </div>
                </>
              ) : isLoggedIn && role === "business" ? (
                <>
                  {/* Mobile Authenticated Business View */}
                  <nav className="flex flex-col gap-4 px-2">
                    <Link
                      href="/dashboard/business"
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium text-foreground py-3 px-4 rounded-xl hover:bg-secondary/50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/jobs"
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium text-foreground py-3 px-4 rounded-xl hover:bg-secondary/50"
                    >
                      Jobs
                    </Link>
                  </nav>

                  {/* Mobile User Actions */}
                  <div className="flex flex-col gap-3 pt-6 border-t border-border/50 px-2">
                    <Button variant="outline" size="lg" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button variant="outline" size="lg" className="w-full justify-start">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help Center
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={onLogout}
                      className="w-full justify-start text-red-500 hover:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </Button>
                  </div>
                </>
              ) : (
                <>
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
                        onLogin?.();
                      }}
                      className="w-full justify-center"
                    >
                      Log In
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => {
                        setOpen(false);
                        onSignup?.();
                      }}
                      className="w-full justify-center"
                    >
                      Sign Up
                    </Button>
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
