import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Manage your account settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">User</p>
              <p className="text-sm text-muted-foreground">user@example.com</p>
            </div>
          </div>
          <Button variant="outline">Logout</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Customize your app&apos;s appearance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="theme-switch" className="font-semibold">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable dark mode.
              </p>
            </div>
            <Switch id="theme-switch" defaultChecked />
          </div>
          <div className="space-y-4 rounded-lg border p-4">
              <Label className="font-semibold">Accent Color</Label>
              <p className="text-sm text-muted-foreground">
                Choose an accent color for the UI.
              </p>
              <div className="flex gap-2 pt-2">
                <Button className="h-8 w-8 rounded-full bg-primary" />
                <Button className="h-8 w-8 rounded-full bg-red-500" />
                <Button className="h-8 w-8 rounded-full bg-blue-500" />
                <Button className="h-8 w-8 rounded-full bg-green-500" />
                <Button className="h-8 w-8 rounded-full bg-yellow-500" />
              </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Playback</CardTitle>
          <CardDescription>
            Manage your playback settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-4 rounded-lg border p-4">
            <Label className="font-semibold">Audio Quality</Label>
            <RadioGroup defaultValue="auto" className="pt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auto" id="q-auto" />
                <Label htmlFor="q-auto">Auto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="q-low" />
                <Label htmlFor="q-low">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="q-medium" />
                <Label htmlFor="q-medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="q-high" />
                <Label htmlFor="q-high">High</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="visualizer-switch" className="font-semibold">Audio Visualizer</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable the audio visualizer.
              </p>
            </div>
            <Switch id="visualizer-switch" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
