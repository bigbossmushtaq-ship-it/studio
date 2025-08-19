
'use client';

import Link from 'next/link';
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
import { useRouter } from 'next/navigation';
import { useApp } from '@/hooks/use-app';
import * as React from 'react';

export default function ChooseUsernamePage() {
  const router = useRouter();
  const { setUsername } = useApp();
  const [usernameInput, setUsernameInput] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUsername(usernameInput);
    router.push('/home');
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Logo className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl text-center">
            Choose your username
          </CardTitle>
          <CardDescription className="text-center">
            This will be your unique name on TuneFlow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="e.g., musiclover99"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Confirm Username
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
