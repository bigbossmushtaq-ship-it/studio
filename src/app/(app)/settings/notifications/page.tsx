
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function NotificationSettingsPage() {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Control how you receive updates from us.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="space-y-2">
            <Label htmlFor="notifications-toggle">Enable Push Notifications</Label>
            <div className="flex items-center">
             <Switch id="notifications-toggle" />
            </div>
          </div>
        </CardContent>
      </Card>
  )
}
