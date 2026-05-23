import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Globe } from "lucide-react";

export function Contact() {
  const socials = [
    { icon: <Github />, label: "GitHub", href: "https://github.com" },
    { icon: <Linkedin />, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: <Twitter />, label: "Twitter", href: "https://twitter.com" },
    { icon: <Globe />, label: "Portfolio", href: "#" },
  ];

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Let&apos;s Connect</h2>
              <p className="text-muted-foreground text-lg max-w-md">
                Interested in working together or just want to say hi? 
                I&apos;m always open to discussing new projects and creative ideas.
              </p>
            </div>

            <div className="space-y-6">
              <ContactInfo icon={<Mail className="w-5 h-5 text-primary" />} title="Email" value="ahmed.sobhy@digital.com" />
              <ContactInfo icon={<Phone className="w-5 h-5 text-primary" />} title="Phone" value="+20 123 456 7890" />
              <ContactInfo icon={<MapPin className="w-5 h-5 text-primary" />} title="Location" value="Cairo, Egypt" />
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-semibold">Follow My Journey</h3>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Your Name</label>
                  <Input placeholder="John Doe" className="bg-background/50 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <Input placeholder="john@example.com" className="bg-background/50 border-white/10" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Subject</label>
                <Input placeholder="Project Inquiry" className="bg-background/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <Textarea placeholder="Tell me about your project..." className="bg-background/50 border-white/10 min-h-[150px]" />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg font-semibold">
                Send Message
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
