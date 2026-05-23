import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, BarChart2 } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Projects() {
  const projects = [
    {
      id: "project-1",
      title: "UAE Market Entry",
      desc: "Scaling a local Egyptian brand to the UAE market, achieving a 4.2x ROAS in the first 90 days.",
      tags: ["Meta Ads", "Audience Testing", "Market Expansion"],
      link: "#",
    },
    {
      id: "project-2",
      title: "Luxury Watch E-comm",
      desc: "Optimized unit economics for a high-ticket retailer, reducing CAC by 35% while increasing volume.",
      tags: ["Google Search", "Retargeting", "Unit Economics"],
      link: "#",
    },
    {
      id: "project-3",
      title: "TikTok Growth Engine",
      desc: "Massive scale for a beauty brand using creator-led content and TikTok Spark Ads.",
      tags: ["TikTok Ads", "UGC Strategy", "Creative Testing"],
      link: "#",
    },
    {
      id: "project-4",
      title: "Omnichannel Analytics",
      desc: "Built a custom tracking dashboard to unify data from Meta, Google, and CRM for clear attribution.",
      tags: ["GA4", "Data Vis", "Attribution"],
      link: "#",
    },
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
          {projects.map((p) => {
            const img = PlaceHolderImages.find((i) => i.id === p.id);
            return (
              <Card key={p.id} className="group glass overflow-hidden border-white/5">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={img?.imageUrl || ""}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    data-ai-hint="marketing chart dashboard"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Button size="sm" variant="secondary" className="gap-2" asChild>
                      <a href={p.link}><BarChart2 className="w-4 h-4" /> View Metrics</a>
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {p.tags.map((tag) => (
                      <span key={tag} className="text-[10px] uppercase tracking-widest font-bold text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <CardTitle className="text-2xl">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{p.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
