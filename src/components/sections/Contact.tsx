'use client';

import { useState } from "react";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Linkedin, Calendar, TrendingUp, Loader2, Sparkles } from "lucide-react";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export function Contact() {
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    markets: '',
    monthlySpend: '',
    goals: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    
    setLoading(true);
    const leadsCollection = collection(db, 'leads');
    const leadData = {
      ...form,
      createdAt: serverTimestamp()
    };

    // Initiate write without await for immediate UI response
    addDoc(leadsCollection, leadData)
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: leadsCollection.path,
          operation: 'create',
          requestResourceData: leadData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });

    // Provide immediate optimistic feedback
    toast({
      title: "Strategy Request Sent",
      description: "Ahmed has been notified. Check your dashboard if you are admin.",
    });
    
    // Clear form and loading state immediately
    setForm({ name: '', brand: '', markets: '', monthlySpend: '', goals: '' });
    setLoading(false);
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-3xl rounded-full -ml-32 -mb-32" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <Badge text="Scale Your Business" />
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Deploy Capital with <span className="text-primary">Confidence</span></h2>
              <p className="text-muted-foreground text-lg max-w-md">
                Ready to stop testing and start scaling? Let&apos;s build your market expansion plan and optimize your unit economics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ContactInfo icon={<Mail className="w-5 h-5 text-primary" />} title="Direct Email" value="ahmed@marketing.com" />
              <ContactInfo icon={<Phone className="w-5 h-5 text-primary" />} title="WhatsApp" value="+20 123 456 7890" />
              <ContactInfo icon={<MapPin className="w-5 h-5 text-primary" />} title="Global Markets" value="Cairo, Dubai, Riyadh" />
              <ContactInfo icon={<Linkedin className="w-5 h-5 text-primary" />} title="Network" value="linkedin.com/in/ahmed" />
            </div>

            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4 items-center">
              <div className="p-3 bg-primary/20 rounded-xl">
                <TrendingUp className="text-primary w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg">Growth Audit</p>
                <p className="text-sm text-muted-foreground">Limited spots available for free strategy sessions this month.</p>
              </div>
            </div>
          </div>

          <Card className="glass border-white/5 shadow-2xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2 text-center">
                <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" /> Request Audit
                </h3>
                <p className="text-sm text-muted-foreground">Fill in your brand details to initiate a strategy consultation.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Name</label>
                    <Input 
                      required
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      placeholder="John Smith" 
                      className="bg-background/50 border-white/10 h-12" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brand Name</label>
                    <Input 
                      required
                      value={form.brand}
                      onChange={e => setForm({...form, brand: e.target.value})}
                      placeholder="E-comm Store" 
                      className="bg-background/50 border-white/10 h-12" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Markets</label>
                    <Input 
                      value={form.markets}
                      onChange={e => setForm({...form, markets: e.target.value})}
                      placeholder="e.g. UAE, Saudi" 
                      className="bg-background/50 border-white/10 h-12" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Monthly Spend</label>
                    <Input 
                      required
                      value={form.monthlySpend}
                      onChange={e => setForm({...form, monthlySpend: e.target.value})}
                      placeholder="$5k - $50k" 
                      className="bg-background/50 border-white/10 h-12" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">What are your scaling goals?</label>
                  <Textarea 
                    value={form.goals}
                    onChange={e => setForm({...form, goals: e.target.value})}
                    placeholder="Scale to $10k/day with 3x ROAS..." 
                    className="bg-background/50 border-white/10 min-h-[100px]" 
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg font-bold shadow-lg shadow-primary/20 gap-2" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  Request Performance Strategy
                </Button>
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                  Guaranteed Response within 24 Hours
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ContactInfo({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-card/50 hover:border-primary/20 transition-colors">
      <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-1">{title}</h4>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
      {text}
    </div>
  );
}
