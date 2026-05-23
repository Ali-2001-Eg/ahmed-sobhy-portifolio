"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Expertise", href: "#about" },
    { label: "Case Studies", href: "#projects" },
    { label: "AI Ad Tool", href: "#ai-tool" },
    { label: "Consultation", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="#home" className="text-xl font-bold tracking-tighter text-primary">
          SOBHY<span className="text-secondary">.MARKETING</span>
        </Link>
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium hover:text-primary transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10" asChild>
          <Link href="#contact">Book a Meeting</Link>
        </Button>
      </div>
    </nav>
  );
}
