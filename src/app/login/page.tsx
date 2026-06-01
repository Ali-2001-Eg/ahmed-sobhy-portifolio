
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Lock, ExternalLink, Info } from 'lucide-react';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Invalid email or password. Ensure you have created this user in the Firebase Console.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background space-y-6">
      <Card className="w-full max-w-md glass border-primary/20">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
          <CardDescription>Enter your credentials to manage your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@marketing.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50 border-white/10"
              />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="max-w-md w-full">
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4" />
          <AlertTitle>First time setting up?</AlertTitle>
          <AlertDescription className="space-y-3">
            <p className="text-sm opacity-90">
              To log in, you must first create an admin user in your Firebase Console.
            </p>
            <ol className="text-xs list-decimal pl-4 space-y-1 opacity-80">
              <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" className="underline inline-flex items-center gap-1">Firebase Console <ExternalLink className="w-2 h-2" /></a></li>
              <li>Select your project <b>studio-4950320879</b></li>
              <li>Navigate to <b>Authentication</b> &gt; <b>Users</b></li>
              <li>Click <b>Add user</b> and set your email/password</li>
              <li>Use those credentials to log in above</li>
            </ol>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
