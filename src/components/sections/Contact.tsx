import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Linkedin, Calendar, TrendingUp } from "lucide-react";

export function Contact() {
  const socials = [
    { icon: <Linkedin />, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: <TrendingUp />, label: "Growth Case Studies", href: "#" },
  ];

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Scale Your Engine</h2>
              <p className="text-muted-foreground text-lg max-w-md">
                Ready to deploy capital with precision? Let&apos;s discuss your e-commerce growth 
                and market expansion plans.
              </p>
            </div>

            <div className="space-y-6">
              <ContactInfo icon={<Mail className="w-5 h-5 text-primary" />} title="Direct Email" value="ahmed.sobhy@marketing.com" />
              <ContactInfo icon={<Phone className="w-5 h-5 text-primary" />} title="WhatsApp" value="+20 123 456 7890" />
              <ContactInfo icon={<MapPin className="w-5 h-5 text-primary" />} title="Operating Markets" value="Cairo, Dubai, Riyadh" />
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-semibold">Professional Network</h3>
              <div className="flex gap-4">
                {socials.map((s, i) => (
                  <Button key={i} variant="outline" size="icon" className="rounded-full glass border-white/5 hover:border-primary/50 transition-colors" asChild>
                    <a href={s.href} aria-label={s.label}>{s.icon}</a>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Card className="glass border-white/5">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4 text-center mb-6">
                <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Schedule a Consultation</h3>
                <p className="text-sm text-muted-foreground">Request a strategy audit or market expansion plan.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <Input placeholder="John Smith" className="bg-background/50 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Brand/Company</label>
                  <Input placeholder="E-comm Store Name" className="bg-background/50 border-white/10" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Target Markets</label>
                <Input placeholder="e.g. UAE, Egypt, Saudi Arabia" className="bg-background/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Current Monthly Ad Spend</label>
                <Input placeholder="$5,000 - $50,000" className="bg-background/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Growth Goals</label>
                <Textarea placeholder="Tell me about your scaling targets..." className="bg-background/50 border-white/10 min-h-[120px]" />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg font-semibold">
                Request Strategy Call
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ContactInfo({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-xl bg-card border border-white/5">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
