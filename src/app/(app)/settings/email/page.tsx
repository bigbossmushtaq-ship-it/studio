
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EmailSettingsPage() {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>
            Manage your email address and notification preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex items-center gap-2">
                <Input id="email" type="email" defaultValue="m@example.com" className="max-w-sm"/>
                <Button>Update</Button>
            </div>
          </div>
          <div className="space-y-4 border-t pt-4">
             <div className="flex items-center justify-between">
                <Label htmlFor="new-music-emails">New Music Alerts</Label>
                <Switch id="new-music-emails" defaultChecked/>
            </div>
             <div className="flex items-center justify-between">
                <Label htmlFor="playlist-emails">Playlist Updates</Label>
                <Switch id="playlist-emails" />
            </div>
             <div className="flex items-center justify-between">
                <Label htmlFor="promo-emails">Promotional Emails</Label>
                <Switch id="promo-emails" />
            </div>
          </div>
        </CardContent>
      </Card>
  )
}
