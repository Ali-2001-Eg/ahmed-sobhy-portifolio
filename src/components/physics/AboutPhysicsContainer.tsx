'use client';

import * as React from 'react';
import { Briefcase, CalendarClock, Globe2, MapPin, Sparkles, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FallingPhysicsContainer, type PhysicsItem } from './FallingPhysicsContainer';

/**
 * An "About me" fact. `kind` drives how big and loud the falling tag is:
 * `headline` for the identity line, `stat` for numbers, `pill` for everything else.
 */
export interface AboutTag {
  id: string;
  label: string;
  subtitle?: string;
  kind?: 'headline' | 'stat' | 'pill';
  color?: string;
  icon?: React.ReactNode;
}

export interface AboutPhysicsContainerProps {
  tags?: AboutTag[];
  height?: number;
  className?: string;
}

const PRIMARY = 'hsl(var(--primary))';
const SECONDARY = 'hsl(var(--secondary))';

/** Sample data — swap for real profile fields when you have them. */
export const aboutTags: AboutTag[] = [
  {
    id: 'role',
    label: 'Senior Media Buyer',
    subtitle: 'Performance & growth',
    kind: 'headline',
    color: PRIMARY,
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    id: 'experience',
    label: '6+ Years',
    subtitle: 'Paid media',
    kind: 'stat',
    color: SECONDARY,
    icon: <CalendarClock className="h-4 w-4" />,
  },
  {
    id: 'spend',
    label: '$4M+ Managed',
    subtitle: 'Ad spend',
    kind: 'stat',
    color: PRIMARY,
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: 'focus',
    label: 'Unit Economics',
    kind: 'pill',
    color: SECONDARY,
    icon: <Target className="h-4 w-4" />,
  },
  { id: 'meta', label: 'Meta Ads', kind: 'pill', color: PRIMARY },
  { id: 'google', label: 'Google Ads', kind: 'pill', color: PRIMARY },
  { id: 'tiktok', label: 'TikTok Ads', kind: 'pill', color: SECONDARY },
  { id: 'tracking', label: 'GA4 · GTM · Server-Side', kind: 'pill', color: SECONDARY },
  {
    id: 'location',
    label: 'Cairo, Egypt',
    subtitle: 'Remote friendly',
    kind: 'pill',
    color: PRIMARY,
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    id: 'markets',
    label: 'Egypt · UAE · GCC',
    kind: 'pill',
    color: SECONDARY,
    icon: <Globe2 className="h-4 w-4" />,
  },
];

export function AboutPhysicsContainer({
  tags = aboutTags,
  height = 460,
  className,
}: AboutPhysicsContainerProps) {
  // Stable identity keeps the physics effect from tearing down on every render.
  const items = React.useMemo<PhysicsItem[]>(
    () =>
      tags.map((tag) => ({
        id: tag.id,
        label: tag.label,
        subtitle: tag.subtitle,
        color: tag.color,
        icon: tag.icon,
      })),
    [tags]
  );

  const kindById = React.useMemo(
    () => new Map(tags.map((tag) => [tag.id, tag.kind ?? 'pill'] as const)),
    [tags]
  );

  return (
    <FallingPhysicsContainer
      items={items}
      variant="tag"
      height={height}
      className={className}
      restitution={0.45}
      friction={0.3}
      itemsPerSpawnRow={3}
      renderItem={(item) => {
        const kind = kindById.get(item.id) ?? 'pill';
        const color = item.color ?? PRIMARY;
        return (
          <div
            className={cn(
              'glass flex items-center justify-center gap-2 rounded-full text-center shadow-lg [&>svg]:shrink-0',
              kind === 'headline' && 'px-6 py-3.5 text-base font-bold',
              kind === 'stat' && 'px-5 py-3 text-sm font-bold',
              kind === 'pill' && 'px-4 py-2 text-sm font-medium'
            )}
            style={{ borderColor: color, color, boxShadow: `0 0 28px -14px ${color}` }}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.subtitle && (
              <span className="text-xs font-normal text-muted-foreground">{item.subtitle}</span>
            )}
          </div>
        );
      }}
    />
  );
}
