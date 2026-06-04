
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Loader2, ArrowLeft, BarChart3, TrendingUp, Target, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();

  const projectRef = useMemoFirebase(() => {
    if (!db || !id) return null;
    return doc(db, 'projects', id as string);
  }, [db, id]);

  const { data: project, loading } = useDoc(projectRef);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-6">
        <h1 className="text-4xl font-bold mb-4">Case Study Not Found</h1>
        <Button onClick={() => router.push('/')} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-16">
        <div className="space-y-6">
          <Button onClick={() => router.push('/')} variant="ghost" className="text-muted-foreground hover:text-primary gap-2 -ml-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{project.title}</h1>
              <div className="flex flex-wrap gap-3">
                {project.tags?.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 bg-card/50 p-6 rounded-2xl border border-white/5 w-full lg:w-auto">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Target ROAS</p>
                <p className="text-3xl font-bold text-primary">{project.roas || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">CAC Reduction</p>
                <p className="text-3xl font-bold text-secondary">{project.cacReduction || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
          <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-3xl font-bold">Strategy & Outcomes</h2>
            <div className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
              {project.description}
            </div>
            
            {project.gallery && project.gallery.length > 0 && (
              <div className="space-y-8 pt-8">
                <h3 className="text-2xl font-bold">Project Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.gallery.map((img: string, idx: number) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-colors">
                      <Image src={img} alt={`Gallery image ${idx + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Target className="text-primary w-5 h-5" /> Key Focus Areas
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="p-1 rounded bg-primary/20 mt-1"><BarChart3 className="w-3 h-3 text-primary" /></div>
                  <span className="text-sm text-muted-foreground">Unit Economics Optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 rounded bg-primary/20 mt-1"><TrendingUp className="w-3 h-3 text-primary" /></div>
                  <span className="text-sm text-muted-foreground">Scalable Testing Frameworks</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 rounded bg-primary/20 mt-1"><ExternalLink className="w-3 h-3 text-primary" /></div>
                  <span className="text-sm text-muted-foreground">Full Funnel Media Deployment</span>
                </li>
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12" onClick={() => router.push('/#contact')}>
                Discuss a Similar Strategy
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
