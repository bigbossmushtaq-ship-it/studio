
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function EmailSettingsPage() {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>
            Manage your email address and communication preferences.
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
           <div className="space-y-4 pt-4 border-t">
            <Label className="font-semibold">Email Notifications</Label>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="promo-emails">Promotional Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive offers and promotions.</p>
                </div>
                <Switch id="promo-emails" />
            </div>
          </div>
        </CardContent>
      </Card>
  )
}
