
"use client"

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function NotificationSettingsPage() {
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [newMusicEmails, setNewMusicEmails] = React.useState(true);
  const [playlistEmails, setPlaylistEmails] = React.useState(false);

  return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Control how you receive updates from us.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-4">
            <Label className="font-semibold">Push Notifications</Label>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="notifications-toggle">Enable Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates on your device.</p>
                </div>
                <Switch 
                  id="notifications-toggle" 
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
            </div>
          </div>
           <div className="space-y-4">
            <Label className="font-semibold">Email Notifications</Label>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="new-music-emails">New Music Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified about new releases.</p>
                </div>
                <Switch 
                  id="new-music-emails" 
                  checked={newMusicEmails}
                  onCheckedChange={setNewMusicEmails}
                />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="playlist-emails">Playlist Updates</Label>
                    <p className="text-sm text-muted-foreground">Get updates on your favorite playlists.</p>
                </div>
                <Switch 
                  id="playlist-emails" 
                  checked={playlistEmails}
                  onCheckedChange={setPlaylistEmails}
                />
            </div>
          </div>
        </CardContent>
      </Card>
  )
}
