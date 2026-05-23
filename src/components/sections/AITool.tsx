"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Copy, Check, Megaphone } from "lucide-react";
import { generateAhmedContent } from "@/ai/flows/ahmed-content-generator-flow";

export function AITool() {
  const [keywords, setKeywords] = useState("");
  const [contentType, setContentType] = useState<any>("ad_copy");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!keywords.trim()) return;
    setLoading(true);
    try {
      const { generatedContent } = await generateAhmedContent({
        keywords,
        contentType,
      });
      setResult(generatedContent);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="ai-tool" className="section-padding bg-card/20">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-secondary/10 text-secondary mb-2">
            <Megaphone className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-bold">AI Performance Assistant</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ahmed, use this tool to draft high-converting ad copy or strategy briefs 
            for your next expansion plan or test campaign.
          </p>
        </div>

        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Ad & Strategy Generator</CardTitle>
            <CardDescription>Enter product details or target audience to generate content.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Output Goal</label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="bg-background/50 border-white/10">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ad_copy">FB/IG Ad Copy</SelectItem>
                    <SelectItem value="strategy_brief">Expansion Strategy</SelectItem>
                    <SelectItem value="tagline">Personal Tagline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Product/Audience Details</label>
                <Textarea 
                  placeholder="e.g., Luxury leather bags, Target: UAE expats, Goal: Scale to $10k/day spend..."
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="bg-background/50 border-white/10 min-h-[100px]"
                />
              </div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg font-semibold gap-2"
              onClick={handleGenerate}
              disabled={loading || !keywords}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate Conversion-Focused Content
            </Button>

            {result && (
              <div className="mt-8 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-secondary uppercase tracking-widest text-xs">AI Generated Draft</h3>
                  <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-muted-foreground hover:text-primary gap-2">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <div className="p-6 rounded-xl bg-background/50 border border-white/5 text-lg leading-relaxed whitespace-pre-wrap italic text-muted-foreground">
                  &ldquo;{result}&rdquo;
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
