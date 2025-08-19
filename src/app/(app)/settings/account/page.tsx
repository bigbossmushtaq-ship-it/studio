
"use client"

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExternalLink, ClipboardCopy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/hooks/use-app";

export default function AccountSettingsPage() {
  const { username } = useApp();
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(username);
    toast({
      title: "Copied!",
      description: "Username copied to clipboard.",
    });
  };

  return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Label>Username</Label>
                    <p className="text-muted-foreground font-mono">{username}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={copyToClipboard}><ClipboardCopy className="h-5 w-5"/></Button>
            </div>
             <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Label>Email</Label>
                    <p className="text-muted-foreground">novamusic0987@gmail.com</p>
                </div>
                <Button variant="ghost" size="icon"><ExternalLink className="h-5 w-5"/></Button>
            </div>
             <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Label>Account overview</Label>
                    <p className="text-sm text-muted-foreground">View more account details on the web.</p>
                </div>
                <Button variant="ghost" size="icon"><ExternalLink className="h-5 w-5"/></Button>
            </div>
          </CardContent>
        </Card>

         <div>
            <p className="text-center text-sm text-muted-foreground">
                To delete your data permanently, <a href="#" className="underline text-primary">close your account</a>.
            </p>
        </div>
      </div>
  )
}
