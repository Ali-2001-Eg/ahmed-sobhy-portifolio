
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, updateDoc, collection, addDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, Save, Trash2, LogOut, LayoutDashboard, Briefcase, Users, UserCircle, Database, ExternalLink, Image as ImageIcon, X } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
      bio: 'I build and operate performance marketing systems that scale e-commerce revenue.',
      email: 'ahmed@marketing.com',
      whatsapp: '+20123456789',
      operatingMarkets: 'Egypt, UAE, Saudi Arabia, GCC',
      linkedin: 'https://linkedin.com',
      heroImageUrl: 'https://picsum.photos/seed/ahmed/600/600'
    };

    setDoc(profileRef, profileData).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: profileRef.path, operation: 'write', requestResourceData: profileData }));
    });

    toast({ title: "Setup Initiated" });
    setInitializing(false);
  };

  const handleSaveProfile = () => {
    if (!profileRef || !editingProfile) return;
    setDoc(profileRef, editingProfile, { merge: true }).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: profileRef.path, operation: 'write', requestResourceData: editingProfile }));
    });
    toast({ title: "Saving Profile" });
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
      imageUrl: 'https://picsum.photos/seed/' + Math.floor(Math.random() * 1000) + '/800/600',
      gallery: []
    };
    addDoc(collection(db, 'projects'), projectData).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'projects', operation: 'create', requestResourceData: projectData }));
    });
  };

  const handleDeleteProject = (id: string) => {
    if (!db) return;
    const projectRef = doc(db, 'projects', id);
    deleteDoc(projectRef).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: projectRef.path, operation: 'delete' }));
    });
  };

  const handleUpdateProjectField = (id: string, data: any) => {
    if (!db) return;
    const projectRef = doc(db, 'projects', id);
    updateDoc(projectRef, data).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: projectRef.path, operation: 'update', requestResourceData: data }));
    });
  }

  const handleAddGalleryImage = (projectId: string, currentGallery: string[]) => {
    const newUrl = prompt("Enter Image URL:");
    if (newUrl) {
      handleUpdateProjectField(projectId, { gallery: [...(currentGallery || []), newUrl] });
    }
  };

  const handleRemoveGalleryImage = (projectId: string, currentGallery: string[], index: number) => {
    const newGallery = currentGallery.filter((_, i) => i !== index);
    handleUpdateProjectField(projectId, { gallery: newGallery });
  };

  const handleDeleteLead = (id: string) => {
    if (!db) return;
    const leadRef = doc(db, 'leads', id);
    deleteDoc(leadRef).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: leadRef.path, operation: 'delete' }));
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
                <Database className="w-4 h-4" /> Init Setup
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
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
                <CardDescription>Manage your prospective client pipeline.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Spend</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads?.map((lead: any) => (
                      <TableRow key={lead.id} className="group">
                        <TableCell className="text-xs text-muted-foreground">
                          {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString() : 'Just now'}
                        </TableCell>
                        <TableCell className="font-bold">{lead.brand}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-muted-foreground">{lead.email}</p>
                            {lead.phone && <p className="text-muted-foreground text-[10px]">{lead.phone}</p>}
                          </div>
                        </TableCell>
                        <TableCell className="text-primary font-medium">{lead.monthlySpend}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteLead(lead.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="glass border-white/5 shadow-xl">
              <CardHeader>
                <CardTitle>Professional Identity</CardTitle>
                <CardDescription>Changes here update your website identity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingProfile && (
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
                      <label className="text-sm font-medium">Hero Image URL</label>
                      <div className="flex gap-2">
                        <Input value={editingProfile.heroImageUrl || ''} onChange={e => setEditingProfile({...editingProfile, heroImageUrl: e.target.value})} placeholder="https://..." />
                        {editingProfile.heroImageUrl && <ImageIcon className="text-primary" />}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bio</label>
                      <Textarea value={editingProfile.bio || ''} onChange={e => setEditingProfile({...editingProfile, bio: e.target.value})} />
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full h-12 gap-2">
                      <Save className="w-5 h-5" /> Sync Profile to Site
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Case Study Management</h2>
                <Button onClick={handleAddProject} className="gap-2"><Plus className="w-4 h-4" /> Add New Case Study</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects?.map((p: any) => (
                  <Card key={p.id} className="glass border-white/5 shadow-xl">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <Input value={p.title || ''} onChange={(e) => handleUpdateProjectField(p.id, { title: e.target.value })} className="font-bold bg-background/50" />
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(p.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Main Preview Image URL</label>
                        <Input value={p.imageUrl || ''} onChange={(e) => handleUpdateProjectField(p.id, { imageUrl: e.target.value })} className="bg-background/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Gallery Images (Multiple)</label>
                        <div className="grid grid-cols-3 gap-2">
                          {p.gallery?.map((img: string, idx: number) => (
                            <div key={idx} className="relative group aspect-square rounded-md overflow-hidden bg-muted">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button 
                                onClick={() => handleRemoveGalleryImage(p.id, p.gallery, idx)}
                                className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => handleAddGalleryImage(p.id, p.gallery)}
                            className="aspect-square rounded-md border-2 border-dashed border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                      <Textarea value={p.description || ''} onChange={(e) => handleUpdateProjectField(p.id, { description: e.target.value })} className="text-sm bg-background/50" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
