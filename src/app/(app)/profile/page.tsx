import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const themes = [
  { name: 'Default', primary: 'bg-primary' },
  { name: 'Ocean', primary: 'bg-blue-500' },
  { name: 'Forest', primary: 'bg-green-500' },
  { name: 'Sunset', primary: 'bg-orange-500' },
  { name: 'Amethyst', primary: 'bg-purple-500' },
  { name: 'Ruby', primary: 'bg-red-500' },
  { name: 'Gold', primary: 'bg-yellow-500' },
  { name: 'Emerald', primary: 'bg-emerald-500' },
];

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-muted-foreground">Profile</p>
          <h1 className="text-4xl font-bold">User</h1>
          <p className="text-muted-foreground">23 Liked Songs • 4 Playlists</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customization</CardTitle>
          <CardDescription>
            Personalize your TuneFlow experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="visualizer-switch" className="font-semibold">Spectrum Visualizer</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable the audio spectrum animation.
              </p>
            </div>
            <Switch id="visualizer-switch" defaultChecked />
          </div>

          <div className="space-y-2">
             <Label className="font-semibold">Theme</Label>
             <p className="text-sm text-muted-foreground">Choose your favorite color theme.</p>
             <div className="flex flex-wrap gap-2 pt-2">
                {themes.map(theme => (
                  <Button key={theme.name} variant="outline" className="flex items-center gap-2">
                    <span className={cn("h-4 w-4 rounded-full", theme.primary)}></span>
                    {theme.name}
                  </Button>
                ))}
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
