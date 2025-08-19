
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

export default function AccountSettingsPage() {
  return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Username</Label>
              <p className="text-muted-foreground">313nvhd7km2j4e33zebherh4qx3u</p>
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
