"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Mail, Calendar } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";

export function Hero() {
  const headshot = PlaceHolderImages.find((img) => img.id === "hero-headshot");

  return (
    <section id="home" className="relative hero-gradient pt-32 pb-20 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-24">
        <div className="flex-1 space-y-8 animate-fade-in">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full glass border-primary/20 text-secondary text-sm font-semibold">
            Deploying Capital with Precision
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            I&apos;m <span className="text-primary">Ahmed Sobhy</span>, 
            <br /> Media Buyer Senior.
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
            I build and operate performance marketing systems that scale e-commerce revenue — 
            not campaigns that run, but <span className="text-foreground font-semibold">engines that compound</span>. 
            Across Meta, Google, and TikTok, I optimize for sustainable unit economics.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white gap-2" asChild>
              <Link href="#projects">View Case Studies <ArrowRight className="w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="#contact"><Calendar className="w-4 h-4" /> Schedule Consultation</Link>
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-4">
            <LinkIcon icon={<Linkedin />} href="https://linkedin.com" label="LinkedIn" />
            <LinkIcon icon={<Mail />} href="mailto:ahmed@example.com" label="Email" />
          </div>
        </div>
        <div className="flex-1 relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative z-10 w-full aspect-square max-w-[500px] rounded-3xl overflow-hidden border-4 border-white/5 shadow-2xl">
            <Image
              src={headshot?.imageUrl || ""}
              alt="Ahmed Sobhy - Senior Media Buyer"
              width={600}
              height={600}
              className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
              data-ai-hint="professional media buyer"
            />
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
        </div>
      </div>
    </section>
  );
}

function LinkIcon({ icon, href, label }: { icon: React.ReactNode; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-primary transition-colors duration-300"
      aria-label={label}
    >
      {icon}
    </a>
  );
}
