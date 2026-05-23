import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Palette, Zap, Globe, Cpu, Smartphone } from "lucide-react";

export function About() {
  const skills = [
    { icon: <Code2 className="w-6 h-6" />, title: "Fullstack Dev", desc: "React, Next.js, Node.js" },
    { icon: <Palette className="w-6 h-6" />, title: "UI/UX Design", desc: "Figma, Tailwind, Framer" },
    { icon: <Zap className="w-6 h-6" />, title: "Performance", desc: "Vercel, AWS, Optimization" },
    { icon: <Globe className="w-6 h-6" />, title: "Web Solutions", desc: "Scalable enterprise apps" },
    { icon: <Cpu className="w-6 h-6" />, title: "AI Integration", desc: "GenAI, LLMs, Automation" },
    { icon: <Smartphone className="w-6 h-6" />, title: "Mobile Dev", desc: "React Native, Responsive" },
  ];

  return (
    <section id="about" className="section-padding bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold">About Me</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              With over 8 years of experience in the digital space, I help brands and individuals 
              turn their visions into high-performing digital realities. My approach combines 
              technical excellence with user-centric design principles.
            </p>
            <p className="text-muted-foreground">
              Starting as a self-taught developer, I&apos;ve worked with global startups and 
              established enterprises to deliver robust solutions. I believe that every project 
              is an opportunity to innovate and push the boundaries of what&apos;s possible on the web.
            </p>
            <div className="pt-4 flex flex-wrap gap-2">
              {["TypeScript", "React", "Next.js", "GenAI", "PostgreSQL", "Cloud Architecture"].map((tag) => (
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
