import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Projects() {
  const projects = [
    {
      id: "project-1",
      title: "FinTech Dashboard",
      desc: "A comprehensive financial management tool with real-time data visualization.",
      tags: ["Next.js", "Chart.js", "Prisma"],
      demo: "#",
      repo: "#",
    },
    {
      id: "project-2",
      title: "Healthcare App",
      desc: "Connecting patients with doctors seamlessly through secure video consultation.",
      tags: ["React Native", "WebRTC", "Firebase"],
      demo: "#",
      repo: "#",
    },
    {
      id: "project-3",
      title: "Nexus Marketplace",
      desc: "A modern e-commerce platform for high-end digital assets and collectibles.",
      tags: ["Shopify", "React", "Tailwind"],
      demo: "#",
      repo: "#",
    },
    {
      id: "project-4",
      title: "AI Analytics Suite",
      desc: "Empowering businesses with predictive insights using custom LLM models.",
      tags: ["Python", "OpenAI", "React"],
      demo: "#",
      repo: "#",
    },
  ];

  return (
    <section id="projects" className="section-padding">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Selected Projects</h2>
            <p className="text-muted-foreground text-lg max-w-lg">
              A curated selection of my recent work across various industries and technologies.
            </p>
          </div>
          <Button variant="link" className="text-primary p-0 h-auto">View All Projects</Button>
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
                    data-ai-hint={img?.imageHint}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Button size="icon" variant="secondary" className="rounded-full" asChild>
                      <a href={p.demo}><ExternalLink className="w-5 h-5" /></a>
                    </Button>
                    <Button size="icon" variant="secondary" className="rounded-full" asChild>
                      <a href={p.repo}><Github className="w-5 h-5" /></a>
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
