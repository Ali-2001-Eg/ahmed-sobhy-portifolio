'use client';

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { AITool } from "@/components/sections/AITool";
import { Footer } from "@/components/Footer";
import { useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, query, orderBy } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export default function Home() {
  const db = useFirestore();

  // Stabilize the profile reference
  const profileRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'profiles', 'main');
  }, [db]);
  const { data: profile, loading: profileLoading } = useDoc(profileRef);
  
  // Stabilize and sort the projects query
  const projectsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'projects'), orderBy('order', 'asc'));
  }, [db]);
  const { data: projects, loading: projectsLoading } = useCollection(projectsQuery);

  if (profileLoading || projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse tracking-widest uppercase text-xs">Initializing Performance Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero profile={profile} />
      <About profile={profile} />
      <Projects projects={projects || []} />
      <AITool />
      <Contact />
      <Footer />
    </main>
  );
}
