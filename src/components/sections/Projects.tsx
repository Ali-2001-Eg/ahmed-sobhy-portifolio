
'use client';

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, LayoutGrid, Atom } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { FallingPhysicsContainer, type PhysicsItem } from "@/components/physics/FallingPhysicsContainer";

export function Projects({ projects }: { projects: any[] }) {
  // Memoised: a fresh fallback array on every render would give `items` a new
  // identity and tear the physics simulation down mid-flight.
  const displayProjects = React.useMemo(() => (projects?.length > 0 ? projects : [
    {
      id: "demo-project",
      title: "UAE Market Entry",
      description: "Scaling a local Egyptian brand to the UAE market, achieving a 4.2x ROAS in the first 90 days.",
      tags: ["Meta Ads", "Audience Testing"],
      roas: "4.2x",
      cacReduction: "15%",
      imageUrl: "https://picsum.photos/seed/web1/800/600"
    }
  ]), [projects]);

  const [view, setView] = React.useState<"grid" | "physics">("grid");

  // ---- Auto-advancing rail -------------------------------------------------
  const railRef = React.useRef<HTMLDivElement | null>(null);
  // A ref, not state: pausing must not re-render and restart the timer.
  const pausedRef = React.useRef(false);

  React.useEffect(() => {
    if (view !== "grid") return;
    const rail = railRef.current;
    if (!rail) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      // Don't fight the user, and don't animate in a background tab.
      if (pausedRef.current || document.hidden) return;

      const maxScroll = rail.scrollWidth - rail.clientWidth;
      if (maxScroll <= 1) return; // everything already fits — nothing to scroll

      // Derive the step from the real gap between cards rather than hardcoding it.
      const cards = rail.children;
      const step =
        cards.length > 1
          ? (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft
          : rail.clientWidth;

      const atEnd = rail.scrollLeft >= maxScroll - 1;
      rail.scrollTo({
        left: atEnd ? 0 : Math.min(rail.scrollLeft + step, maxScroll),
        behavior: "smooth",
      });
    }, 2000);

    return () => window.clearInterval(id);
  }, [view, displayProjects.length]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  const physicsItems = React.useMemo<PhysicsItem[]>(
    () =>
      displayProjects.map((p, i) => ({
        id: String(p.id),
        label: p.title,
        subtitle: p.description,
        href: `/projects/${p.id}`,
        color: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))",
        meta: [
          ...(p.roas ? [{ label: "ROAS", value: String(p.roas) }] : []),
          ...(p.cacReduction ? [{ label: "CAC \u2193", value: String(p.cacReduction) }] : []),
        ],
      })),
    [displayProjects]
  );

  return (
    <section id="projects" className="section-padding">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Success Stories</h2>
            <p className="text-muted-foreground text-lg max-w-lg">
              Case studies on test campaigns, audience expansion, and high-growth market deployments.
            </p>
          </div>
          <div className="glass inline-flex rounded-full p-1">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-pressed={view === "grid"}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                view === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Grid
            </button>
            <button
              type="button"
              onClick={() => setView("physics")}
              aria-pressed={view === "physics"}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                view === "physics" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Atom className="w-4 h-4" /> Physics
            </button>
          </div>
        </div>

        {view === "physics" ? (
          <FallingPhysicsContainer
            items={physicsItems}
            variant="card"
            height={600}
            itemsPerSpawnRow={3}
            restitution={0.4}
            className="bg-background/40 border border-white/5"
            renderItem={(item) => (
              <Link
                href={item.href ?? "#"}
                className="glass block w-[250px] space-y-3 rounded-2xl p-5 shadow-xl"
                style={{ borderColor: item.color, boxShadow: `0 0 40px -20px ${item.color}` }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: item.color }}
                >
                  Case Study
                </p>
                <h3 className="text-lg font-semibold leading-snug">{item.label}</h3>
                {item.subtitle && (
                  <p className="line-clamp-3 text-sm text-muted-foreground">{item.subtitle}</p>
                )}
                {item.meta && item.meta.length > 0 && (
                  <div className="flex gap-4 border-t border-white/10 pt-3">
                    {item.meta.map((stat) => (
                      <div key={stat.label}>
                        <p className="text-[10px] uppercase text-muted-foreground">{stat.label}</p>
                        <p className="text-sm font-bold" style={{ color: item.color }}>
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Link>
            )}
          />
        ) : (
        <div
          ref={railRef}
          role="region"
          aria-label="Case studies"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocusCapture={pause}
          onBlurCapture={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
          className="flex items-start gap-8 overflow-x-auto snap-x snap-mandatory pb-6 -mx-2 px-2 scroll-smooth"
        >
          {displayProjects.map((p, i) => {
            // Alternate the stack order so the rail reads as a staggered
            // gallery: even cards lead with the image, odd cards lead with the
            // title and carry the image underneath.
            const titleFirst = i % 2 === 1;

            const media = (
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={p.imageUrl}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 380px, 440px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button size="sm" variant="secondary" className="gap-2" asChild>
                    <Link href={`/projects/${p.id}`}>
                      <BarChart2 className="w-4 h-4" /> View Details
                    </Link>
                  </Button>
                </div>
              </div>
            );

            const details = (
              <>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-wrap gap-2">
                      {p.tags?.map((tag: string) => (
                        <span key={tag} className="text-[10px] uppercase tracking-widest font-bold text-secondary">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {p.roas && (
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground uppercase">ROAS</p>
                          <p className="text-sm font-bold text-primary">{p.roas}</p>
                        </div>
                      )}
                      {p.cacReduction && (
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground uppercase">CAC ↓</p>
                          <p className="text-sm font-bold text-secondary">{p.cacReduction}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">{p.description}</p>
                </CardContent>
              </>
            );

            return (
              <Card
                key={p.id}
                className={cn(
                  "group glass overflow-hidden border-white/5 shrink-0 snap-start w-[300px] sm:w-[380px] lg:w-[440px]",
                  // Drop every other card so the row zig-zags instead of sitting flat.
                  titleFirst && "mt-12 lg:mt-24"
                )}
              >
                {titleFirst ? (
                  <>
                    {details}
                    {media}
                  </>
                ) : (
                  <>
                    {media}
                    {details}
                  </>
                )}
              </Card>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
