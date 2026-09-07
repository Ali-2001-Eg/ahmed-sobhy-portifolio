'use client';

import * as React from 'react';
import {
  AboutPhysicsContainer,
  aboutTags,
  type AboutTag,
} from '@/components/physics/AboutPhysicsContainer';
import { FallingPhysicsContainer, type PhysicsItem } from '@/components/physics/FallingPhysicsContainer';

const PRIMARY = 'hsl(var(--primary))';
const SECONDARY = 'hsl(var(--secondary))';

const SKILLS: PhysicsItem[] = [
  { id: 'meta', label: 'Meta Ads', color: PRIMARY },
  { id: 'google', label: 'Google Ads', color: SECONDARY },
  { id: 'tiktok', label: 'TikTok Ads', color: PRIMARY },
  { id: 'snap', label: 'Snapchat Ads', color: SECONDARY },
  { id: 'cbo', label: 'CBO / ABO Scaling', color: PRIMARY },
  { id: 'econ', label: 'Unit Economics', color: SECONDARY },
  { id: 'mer', label: 'MER & ROAS', color: PRIMARY },
  { id: 'ltv', label: 'LTV / CAC', color: SECONDARY },
  { id: 'ga4', label: 'GA4', color: PRIMARY },
  { id: 'gtm', label: 'GTM', color: SECONDARY },
  { id: 'sst', label: 'Server-Side Tagging', color: PRIMARY },
  { id: 'creative', label: 'Creative Testing', color: SECONDARY },
  { id: 'retention', label: 'Retention Strategy', color: PRIMARY },
  { id: 'gcc', label: 'GCC Expansion', color: SECONDARY },
  { id: 'ecom', label: 'E-comm Growth', color: PRIMARY },
];

export function About({ profile }: { profile: any }) {
  const markets: string[] = profile?.operatingMarkets?.split(',') || ['Egypt', 'UAE', 'GCC'];

  // Build the About tags from the live profile where we have it, falling back to
  // the component's own sample data for anything the dashboard hasn't filled in.
  const tags = React.useMemo<AboutTag[]>(() => {
    const overrides: Record<string, Partial<AboutTag>> = {
      role: { label: profile?.title || 'Senior Media Buyer' },
      experience: profile?.yearsExperience
        ? { label: `${profile.yearsExperience}+ Years` }
        : {},
      spend: profile?.managedSpend ? { label: `${profile.managedSpend} Managed` } : {},
      location: profile?.location ? { label: profile.location } : {},
      markets: { label: markets.map((m) => m.trim()).join(' · ') },
    };
    return aboutTags.map((tag) => ({ ...tag, ...(overrides[tag.id] ?? {}) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.title, profile?.yearsExperience, profile?.managedSpend, profile?.location, profile?.operatingMarkets]);

  return (
    <section id="about" className="section-padding bg-card/30">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold">Performance Expertise</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              I specialize in expanding businesses into markets that matter.{' '}
              {markets.slice(0, 3).join('. ')}. With focus on real spend and real outcomes, I
              manage high-budget campaigns that don&apos;t just run—they scale.
            </p>
            <p className="text-muted-foreground">
              My methodology revolves around treating ad spend as investment capital. By focusing
              on unit economics and market-specific consumer behavior, I transform volatile
              marketing efforts into predictable revenue engines.
            </p>
            <p className="text-sm text-muted-foreground/70 pt-2">
              Grab any tag and throw it around — everything here is live physics.
            </p>
          </div>

          <div className="lg:w-1/2 w-full">
            <AboutPhysicsContainer tags={tags} height={560} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-3xl font-bold">The Toolkit</h3>
            <p className="text-muted-foreground max-w-lg">
              Platforms, measurement, and growth levers I work with day to day.
            </p>
          </div>
          <FallingPhysicsContainer
            items={SKILLS}
            variant="tag"
            height={420}
            itemsPerSpawnRow={5}
            className="bg-background/40 border border-white/5"
          />
        </div>
      </div>
    </section>
  );
}
