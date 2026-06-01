
'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Target, TrendingUp, Globe, ShoppingBag, LayoutDashboard } from "lucide-react";

export function About({ profile }: { profile: any }) {
  const skills = [
    { icon: <Target className="w-6 h-6" />, title: "Meta Ads", desc: "Scaling Facebook & IG ads via advanced CBO/ABO strategies." },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Unit Economics", desc: "Optimizing for MER, ROAS, and sustainable LTV/CAC ratios." },
    { icon: <BarChart3 className="w-6 h-6" />, title: "Data Precision", desc: "Advanced tracking via GTM, GA4, and server-side tagging." },
    { icon: <Globe className="w-6 h-6" />, title: "Market Expansion", desc: "Proven results in Egypt, UAE, and GCC markets." },
    { icon: <ShoppingBag className="w-6 h-6" />, title: "E-comm Growth", desc: "Building conversion engines for luxury and retail brands." },
    { icon: <LayoutDashboard className="w-6 h-6" />, title: "Media Planning", desc: "Capital deployment across Google, TikTok, and Snap." },
  ];

  const markets = profile?.operatingMarkets?.split(',') || ["Egypt", "UAE", "GCC"];

  return (
    <section id="about" className="section-padding bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold">Performance Expertise</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              I specialize in expanding businesses into markets that matter. {markets.slice(0, 3).join('. ')}. 
              With focus on real spend and real outcomes, I manage high-budget campaigns 
              that don&apos;t just run—they scale.
            </p>
            <p className="text-muted-foreground">
              My methodology revolves around treating ad spend as investment capital. 
              By focusing on unit economics and market-specific consumer behavior, 
              I transform volatile marketing efforts into predictable revenue engines.
            </p>
            <div className="pt-4 flex flex-wrap gap-2">
              {["Meta Ads", "Google Ads", "TikTok Ads", "Unit Economics", "Retention Strategy", "Scaling GCC"].map((tag) => (
                <Badge key={tag} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-none">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map((skill, idx) => (
              <Card key={idx} className="glass hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6 space-y-3">
                  <div className="p-2 w-fit rounded-lg bg-primary/10 text-primary">
                    {skill.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{skill.title}</h3>
                  <p className="text-sm text-muted-foreground">{skill.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
