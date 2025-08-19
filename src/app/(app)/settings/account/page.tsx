
"use client"

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExternalLink, ClipboardCopy, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/hooks/use-app";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function AccountSettingsPage() {
  const { username, email, profilePic, setProfilePic } = useApp();
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(username);
    toast({
      title: "Copied!",
      description: "Username copied to clipboard.",
    });
  };
  
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        toast({
            title: "Success!",
            description: "Profile picture updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
      <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                    <AvatarImage src={profilePic} alt="Profile Picture" />
                    <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                </Avatar>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePicChange}
                    className="hidden"
                    accept="image/*"
                />
                <Button variant="outline" onClick={handleUploadClick}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Upload new picture
                </Button>
            </CardContent>
        </Card>
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
                    <p className="text-muted-foreground">{email}</p>
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
