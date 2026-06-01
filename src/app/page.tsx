'use client';

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { AITool } from "@/components/sections/AITool";
import { Footer } from "@/components/Footer";
import { useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export default function Home() {
  const db = useFirestore();

  const profileRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'profiles', 'main');
  }, [db]);
  const { data: profile, loading: profileLoading } = useDoc(profileRef);
  
  const projectsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'projects');
  }, [db]);
  const { data: projects, loading: projectsLoading } = useCollection(projectsQuery);

  if (profileLoading || projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
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
