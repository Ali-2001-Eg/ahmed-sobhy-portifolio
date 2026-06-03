'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, updateDoc, collection, addDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, Save, Trash2, LogOut, LayoutDashboard, Briefcase, Users, UserCircle, Database, ExternalLink } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

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
    return query(collection(db, 'projects'), orderBy('order', 'asc'));
  }, [db]);
  const { data: projects, loading: projectsLoading } = useCollection(projectsQuery);

  // Stabilize leads query to only fetch if user is authenticated
  const leadsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
  }, [db, user]);
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

  if (userLoading || (!user && !userLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  const handleSeedData = () => {
    if (!db || !profileRef) return;
    setInitializing(true);
    
    const profileData = {
      name: 'Ahmed Sobhy',
      title: 'Senior Performance Media Buyer',
      bio: 'I build and operate performance marketing systems that scale e-commerce revenue — not campaigns that run, but engines that compound.',
      email: 'ahmed@marketing.com',
      whatsapp: '+20123456789',
      operatingMarkets: 'Egypt, UAE, Saudi Arabia, GCC',
      linkedin: 'https://linkedin.com'
    };

    setDoc(profileRef, profileData)
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: profileRef.path,
          operation: 'write',
          requestResourceData: profileData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    const projectData = {
      title: 'UAE Market Expansion',
      description: 'Scaled a direct-to-consumer brand into the UAE market with focus on high-LTV customers and unit economic efficiency.',
      tags: ['Meta Ads', 'CBO Scaling'],
      roas: '4.5x',
      cacReduction: '22%',
      order: 1,
      imageUrl: 'https://picsum.photos/seed/setup1/800/600'
    };
    
    addDoc(collection(db, 'projects'), projectData).catch(async (err) => {
      const permissionError = new FirestorePermissionError({
        path: 'projects',
        operation: 'create',
        requestResourceData: projectData,
      });
      errorEmitter.emit('permission-error', permissionError);
    });

    toast({ title: "Setup Initiated", description: "Your profile and initial data are being created." });
    setInitializing(false);
  };

  const handleSaveProfile = () => {
    if (!profileRef || !editingProfile) return;
    setDoc(profileRef, editingProfile, { merge: true })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: profileRef.path,
          operation: 'write',
          requestResourceData: editingProfile,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
    toast({ title: "Saving Profile", description: "Updates are being synced to the live website." });
  };

  const handleAddProject = () => {
    if (!db) return;
    const projectData = {
      title: 'New Case Study',
      description: 'Project description...',
      tags: ['Meta Ads'],
      roas: '0.0x',
      cacReduction: '0%',
      order: (projects?.length || 0) + 1,
      imageUrl: 'https://picsum.photos/seed/' + Math.floor(Math.random() * 1000) + '/800/600'
    };
    addDoc(collection(db, 'projects'), projectData)
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: 'projects',
          operation: 'create',
          requestResourceData: projectData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleDeleteProject = (id: string) => {
    if (!db) return;
    const projectRef = doc(db, 'projects', id);
    deleteDoc(projectRef)
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: projectRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleUpdateProjectField = (id: string, data: any) => {
    if (!db) return;
    const projectRef = doc(db, 'projects', id);
    updateDoc(projectRef, data)
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: projectRef.path,
          operation: 'update',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  }

  const handleDeleteLead = (id: string) => {
    if (!db) return;
    const leadRef = doc(db, 'leads', id);
    deleteDoc(leadRef)
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: leadRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
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
            <Button variant="outline" size="sm" asChild className="gap-2 hidden md:flex">
              <a href="/" target="_blank"><ExternalLink className="w-4 h-4" /> View Site</a>
            </Button>
            {!profile && !profileLoading && (
              <Button variant="secondary" size="sm" onClick={handleSeedData} disabled={initializing} className="gap-2">
                {initializing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                Init Setup
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {!profile && !profileLoading && (
          <Card className="border-primary/50 bg-primary/5 animate-pulse">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="text-primary" /> Setup Required
              </CardTitle>
              <CardDescription>
                Click "Init Setup" in the header to create your default profile and start managing your portfolio.
              </CardDescription>
            </CardHeader>
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
                <CardDescription>Manage your prospective client pipeline. Latest requests appear first.</CardDescription>
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
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads?.map((lead: any) => (
                      <TableRow key={lead.id} className="group">
                        <TableCell className="text-xs text-muted-foreground">
                          {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString() : 'Just now'}
                        </TableCell>
                        <TableCell className="font-bold">{lead.brand || 'Unknown Brand'}</TableCell>
                        <TableCell>{lead.name || 'Anonymous'}</TableCell>
                        <TableCell className="text-primary font-medium">{lead.monthlySpend || 'N/A'}</TableCell>
                        <TableCell className="text-sm">{lead.markets || 'Not specified'}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                            onClick={() => handleDeleteLead(lead.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!leads || leads.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic">
                          {leadsLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "No consultation requests yet."}
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
                <CardTitle>Professional Identity</CardTitle>
                <CardDescription>Changes here update your Hero section and Expertise area immediately.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingProfile ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input value={editingProfile.name || ''} onChange={e => setEditingProfile({...editingProfile, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Professional Title</label>
                        <Input value={editingProfile.title || ''} onChange={e => setEditingProfile({...editingProfile, title: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Hero Bio</label>
                      <Textarea className="min-h-[120px]" value={editingProfile.bio || ''} onChange={e => setEditingProfile({...editingProfile, bio: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">WhatsApp Contact</label>
                        <Input value={editingProfile.whatsapp || ''} onChange={e => setEditingProfile({...editingProfile, whatsapp: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input value={editingProfile.email || ''} onChange={e => setEditingProfile({...editingProfile, email: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Active Markets</label>
                        <Input value={editingProfile.operatingMarkets || ''} onChange={e => setEditingProfile({...editingProfile, operatingMarkets: e.target.value})} />
                      </div>
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full h-12 gap-2 text-lg font-bold">
                      <Save className="w-5 h-5" /> Sync Profile to Site
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {profileLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Database connection pending. Use "Init Setup" if first time.'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Case Study Management</h2>
                <Button onClick={handleAddProject} className="gap-2"><Plus className="w-4 h-4" /> Add New Project</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects?.map((p: any) => (
                  <Card key={p.id} className="glass border-white/5 shadow-xl hover:border-primary/20 transition-all">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <Input 
                          value={p.title || ''} 
                          placeholder="Project Title"
                          onChange={(e) => handleUpdateProjectField(p.id, { title: e.target.value })} 
                          className="font-bold text-lg bg-background/50" 
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(p.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Textarea 
                        value={p.description || ''} 
                        placeholder="Describe the strategy and ROI outcome..."
                        onChange={(e) => handleUpdateProjectField(p.id, { description: e.target.value })} 
                        className="text-sm min-h-[100px] bg-background/50"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Target ROAS</label>
                          <Input value={p.roas || ''} placeholder="4.5x" onChange={(e) => handleUpdateProjectField(p.id, { roas: e.target.value })} className="bg-background/50" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">CAC Improvement</label>
                          <Input value={p.cacReduction || ''} placeholder="20%" onChange={(e) => handleUpdateProjectField(p.id, { cacReduction: e.target.value })} className="bg-background/50" />
                        </div>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Display Order</label>
                         <Input type="number" value={p.order || 0} onChange={(e) => handleUpdateProjectField(p.id, { order: parseInt(e.target.value) || 0 })} className="bg-background/50" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {(!projects || projects.length === 0) && !projectsLoading && (
                   <p className="text-muted-foreground text-center col-span-2 py-12 border border-dashed rounded-lg">Your portfolio is empty. Add a case study to display it on the homepage.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
