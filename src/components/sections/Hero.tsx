"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Linkedin, Mail, Calendar } from "lucide-react";
import Link from "next/link";

export function Hero({ profile }: { profile: any }) {
  const name = profile?.name || "Ahmed Sobhy";
  const title = profile?.title || "Senior Performance Media Buyer";
  const bio =
    profile?.bio ||
    "I build and operate performance marketing systems that scale e-commerce revenue — not campaigns that run, but engines that compound.";

  // Ahmed's real portrait is the source of truth. A stock/placeholder URL left
  // over in Firestore should never win over it — only a real upload does.
  const PORTRAIT = "/ahmed-portrait.jpg";
  const stored = profile?.heroImageUrl as string | undefined;
  const isPlaceholder =
    !stored || /picsum\.photos|placehold\.co|unsplash\.com/.test(stored);
  const heroImage = isPlaceholder ? PORTRAIT : stored;

  const markets: string[] = profile?.operatingMarkets
    ? profile.operatingMarkets.split(",").map((m: string) => m.trim())
    : ["Egypt", "UAE", "GCC"];

  // Set the tail of the job title in the display serif for a mixed-type headline.
  const words = title.trim().split(/\s+/);
  const titleHead = words.slice(0, -2).join(" ");
  const titleTail = words.slice(-2).join(" ");

  return (
    <section
      id="home"
      // svh, not vh: mobile browser chrome would otherwise push the CTAs off-screen.
      // Small screens stack: face on top, copy anchored to the bottom.
      className="relative min-h-screen min-h-[100svh] w-full overflow-hidden flex items-end lg:items-center"
    >
      {/* ---- Portrait ----
          Mobile: full bleed, framed high so the face sits in the clear top half.
          Desktop: full height, anchored right, clear of the copy column. */}
      <div className="absolute inset-0 lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[62%]">
        <Image
          src={heroImage}
          alt={`${name} — ${title}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 62vw"
          className="object-cover object-[center_12%] lg:object-[center_28%]"
        />
        {/* Desktop only: blend the portrait's left edge into the page. Kept off
            mobile so it never washes over the face. */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-background via-background/25 to-transparent" />
      </div>

      {/* Mobile: scrim rising from the bottom. The copy lives inside this band,
          so it never overlaps the face above it. */}
      <div className="lg:hidden absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-background via-background/95 to-transparent" />
      {/* Mobile: slight top fade so the fixed navbar stays legible. */}
      <div className="lg:hidden absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background/85 to-transparent" />

      <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30" />
      <div className="absolute inset-0 hero-gradient" />

      {/* ---- Copy ---- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-28 pb-10 lg:pb-20">
        <div className="max-w-2xl space-y-4 lg:space-y-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-secondary/60" />
            <p className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
              {markets.slice(0, 3).join(" · ")}
            </p>
          </div>

          <h1 className="font-bold leading-[0.95] tracking-tight text-4xl sm:text-5xl lg:text-7xl xl:text-8xl">
            <span className="block text-muted-foreground/80 text-base sm:text-2xl lg:text-4xl font-medium mb-2 lg:mb-3">
              I&apos;m {name},
            </span>
            {titleHead && <span className="block">{titleHead}</span>}
            <span className="block font-display italic font-normal text-primary">
              {titleTail}.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-xl leading-relaxed line-clamp-2 lg:line-clamp-none">
            {bio}
          </p>

          <div className="flex flex-wrap gap-3 lg:gap-4 pt-1 lg:pt-2">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white gap-2" asChild>
              <Link href="#projects">
                View Case Studies <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 backdrop-blur-sm" asChild>
              <Link href="#contact">
                <Calendar className="w-4 h-4" /> Schedule Consultation
              </Link>
            </Button>
          </div>

          <div className="hidden sm:flex items-center gap-6 pt-1 lg:pt-2">
            <LinkIcon icon={<Linkedin />} href={profile?.linkedin || "#"} label="LinkedIn" />
            <LinkIcon
              icon={<Mail />}
              href={`mailto:${profile?.email || "ahmed@example.com"}`}
              label="Email"
            />
          </div>
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
