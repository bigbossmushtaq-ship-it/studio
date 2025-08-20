
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons/logo';
import { useApp } from '@/hooks/use-app';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLogin, setIsLogin] = React.useState(true);
  const { login, signup, loading, error, session } = useApp();
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    if (session) {
      router.replace('/home');
    }
  }, [session, router]);
  
  React.useEffect(() => {
    if (error) {
       toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error,
      });
    }
  }, [error, toast]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    let result;
    if (isLogin) {
      result = await login(email, password);
      if(result.success) {
        toast({
          title: 'Login successful!',
          description: 'Welcome back.',
        });
      }
    } else {
      result = await signup(email, password);
       if(result.success) {
        toast({
          title: 'Signup successful!',
          description: 'Please check your email for a verification link to complete your registration.',
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Logo className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl text-center">
            {isLogin ? 'Login to TuneFlow' : 'Create an Account'}
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isLogin ? 'Login' : 'Sign Up'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="underline"
              disabled={loading}
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
