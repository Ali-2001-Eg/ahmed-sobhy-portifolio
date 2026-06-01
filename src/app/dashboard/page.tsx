'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, updateDoc, collection, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, Save, Trash2, LogOut, LayoutDashboard, Briefcase, Users, UserCircle, Database } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

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

  const leadsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'leads');
  }, [db]);
  const { data: leads, loading: leadsLoading } = useCollection(leadsQuery);

  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (profile) {
      setEditingProfile(profile);
    }
  }, [profile]);

  if (userLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  const handleSeedData = async () => {
    if (!db || !profileRef) return;
    setInitializing(true);
    try {
      await setDoc(profileRef, {
        name: 'Ahmed Sobhy',
        title: 'Senior Performance Media Buyer',
        bio: 'I build and operate performance marketing systems that scale e-commerce revenue — not campaigns that run, but engines that compound.',
        email: 'ahmed@marketing.com',
        whatsapp: '+20123456789',
        operatingMarkets: 'Egypt, UAE, Saudi Arabia, GCC',
        linkedin: 'https://linkedin.com'
      });

      if (!projects || projects.length === 0) {
        await addDoc(collection(db, 'projects'), {
          title: 'UAE Market Expansion',
          description: 'Scaled a direct-to-consumer brand into the UAE market with focus on high-LTV customers and unit economic efficiency.',
          tags: ['Meta Ads', 'CBO Scaling'],
          roas: '4.5x',
          cacReduction: '22%',
          order: 1,
          imageUrl: 'https://picsum.photos/seed/setup1/800/600'
        });
      }

      toast({
        title: "Database Initialized",
        description: "Your profile and initial case study have been created.",
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Initialization Failed",
        description: "Check your Firestore security rules or internet connection.",
      });
    } finally {
      setInitializing(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileRef || !editingProfile) return;
    setDoc(profileRef, editingProfile, { merge: true })
      .then(() => {
        toast({ title: "Profile Saved", description: "Your public profile has been updated." });
      })
      .catch((err) => {
        console.error("Error saving profile", err);
      });
  };

  const handleAddProject = async () => {
    if (!db) return;
    addDoc(collection(db, 'projects'), {
      title: 'New Case Study',
      description: 'Project description...',
      tags: ['Meta Ads'],
      roas: '0.0x',
      cacReduction: '0%',
      order: (projects?.length || 0) + 1,
      imageUrl: 'https://picsum.photos/seed/' + Math.floor(Math.random() * 1000) + '/800/600'
    });
  };

  const handleDeleteProject = async (id: string) => {
    if (!db) return;
    deleteDoc(doc(db, 'projects', id));
  };

  const handleLogout = () => {
    if (auth) signOut(auth).then(() => router.push('/login'));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/5 bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-primary w-6 h-6" />
            <h1 className="font-bold text-xl tracking-tight">Sobhy Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            {!profile && !profileLoading && (
              <Button variant="secondary" size="sm" onClick={handleSeedData} disabled={initializing} className="gap-2">
                {initializing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                Init Setup
              </Button>
            )}
            <Button variant="ghost" onClick={handleLogout} className="gap-2 text-muted-foreground">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {!profile && !profileLoading && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="text-primary" /> Get Started
              </CardTitle>
              <CardDescription>
                Your database is empty. Click the button below to seed your initial profile and sample data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleSeedData} disabled={initializing} className="w-full md:w-auto">
                {initializing ? "Initializing..." : "Create Initial Profile & Data"}
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="bg-card/50 p-1 border border-white/5">
            <TabsTrigger value="leads" className="gap-2"><Users className="w-4 h-4" /> Leads</TabsTrigger>
            <TabsTrigger value="profile" className="gap-2"><UserCircle className="w-4 h-4" /> Profile</TabsTrigger>
            <TabsTrigger value="projects" className="gap-2"><Briefcase className="w-4 h-4" /> Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            <Card className="glass border-white/5 shadow-xl">
              <CardHeader>
                <CardTitle>Inbound Consultation Requests</CardTitle>
                <CardDescription>Manage your prospective client pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Spend</TableHead>
                      <TableHead>Markets</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads?.map((lead: any) => (
                      <TableRow key={lead.id}>
                        <TableCell className="text-xs text-muted-foreground">
                          {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString() : 'Recent'}
                        </TableCell>
                        <TableCell className="font-bold">{lead.brand || 'Unknown Brand'}</TableCell>
                        <TableCell>{lead.name || 'Anonymous'}</TableCell>
                        <TableCell className="text-primary font-medium">{lead.monthlySpend || 'N/A'}</TableCell>
                        <TableCell className="text-sm">{lead.markets || 'Not specified'}</TableCell>
                      </TableRow>
                    ))}
                    {(!leads || leads.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No leads received yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="glass border-white/5 shadow-xl">
              <CardHeader>
                <CardTitle>Core Profile Info</CardTitle>
                <CardDescription>Update your Professional Name, Bio, and Contact info</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingProfile ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Professional Name</label>
                        <Input value={editingProfile.name || ''} onChange={e => setEditingProfile({...editingProfile, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Professional Title</label>
                        <Input value={editingProfile.title || ''} onChange={e => setEditingProfile({...editingProfile, title: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Professional Bio</label>
                      <Textarea className="min-h-[120px]" value={editingProfile.bio || ''} onChange={e => setEditingProfile({...editingProfile, bio: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">WhatsApp</label>
                        <Input value={editingProfile.whatsapp || ''} onChange={e => setEditingProfile({...editingProfile, whatsapp: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input value={editingProfile.email || ''} onChange={e => setEditingProfile({...editingProfile, email: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Markets (comma separated)</label>
                        <Input value={editingProfile.operatingMarkets || ''} onChange={e => setEditingProfile({...editingProfile, operatingMarkets: e.target.value})} />
                      </div>
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full gap-2">
                      <Save className="w-4 h-4" /> Save Profile Changes
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {profileLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Click "Init Setup" above to start.'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Performance Case Studies</h2>
                <Button onClick={handleAddProject} className="gap-2"><Plus className="w-4 h-4" /> Add Case Study</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects?.map((p: any) => (
                  <Card key={p.id} className="glass border-white/5 shadow-xl">
                    <CardContent className="p-6 space-y-4">
                      <Input 
                        value={p.title || ''} 
                        placeholder="Project Title"
                        onChange={(e) => updateDoc(doc(db!, 'projects', p.id), { title: e.target.value })} 
                        className="font-bold text-lg" 
                      />
                      <Textarea 
                        value={p.description || ''} 
                        placeholder="Describe the strategy and outcome..."
                        onChange={(e) => updateDoc(doc(db!, 'projects', p.id), { description: e.target.value })} 
                        className="text-sm min-h-[80px]"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-muted-foreground">ROAS</label>
                          <Input value={p.roas || ''} onChange={(e) => updateDoc(doc(db!, 'projects', p.id), { roas: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-muted-foreground">CAC Reduction</label>
                          <Input value={p.cacReduction || ''} onChange={(e) => updateDoc(doc(db!, 'projects', p.id), { cacReduction: e.target.value })} />
                        </div>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(p.id)} className="w-full gap-2">
                        <Trash2 className="w-4 h-4" /> Remove Project
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {(!projects || projects.length === 0) && !projectsLoading && (
                   <p className="text-muted-foreground text-center col-span-2 py-12 border border-dashed rounded-lg">No projects added yet.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
