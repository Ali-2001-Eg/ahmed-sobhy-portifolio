
'use client';

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, BarChart2, TrendingUp, Target } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Projects({ projects }: { projects: any[] }) {
  const displayProjects = projects?.length > 0 ? projects : [
    {
      id: "project-1",
      title: "UAE Market Entry",
      description: "Scaling a local Egyptian brand to the UAE market, achieving a 4.2x ROAS in the first 90 days.",
      tags: ["Meta Ads", "Audience Testing"],
      roas: "4.2x",
      cacReduction: "15%"
    }
  ];

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
          <Button variant="link" className="text-primary p-0 h-auto">View All Metrics</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayProjects.map((p) => {
            const img = PlaceHolderImages.find((i) => i.id === p.id) || PlaceHolderImages[0];
            return (
              <Card key={p.id} className="group glass overflow-hidden border-white/5">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={p.imageUrl || img.imageUrl}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    data-ai-hint="marketing chart dashboard"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Button size="sm" variant="secondary" className="gap-2">
                      <BarChart2 className="w-4 h-4" /> View Details
                    </Button>
                  </div>
                </div>
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
                  <p className="text-muted-foreground">{p.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
