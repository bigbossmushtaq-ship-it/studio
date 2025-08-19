
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SettingsPage() {
  const { theme, setTheme, spectrumVisualEffects, setSpectrumVisualEffects } = useTheme();
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Customize the appearance and behavior of TuneFlow.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Change the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">Theme</Label>
            <RadioGroup
              defaultValue={theme}
              onValueChange={(value) => setTheme(value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="theme-default" id="r1" />
                <Label htmlFor="r1">Default</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="theme-violet" id="r2" />
                <Label htmlFor="r2">Violet</Label>
              </div>
               <div className="flex items-center space-x-2">
                <RadioGroupItem value="theme-green" id="r3" />
                <Label htmlFor="r3">Green</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="visualizer-toggle">Enable Spectrum Visualizer</Label>
            <Switch
              id="visualizer-toggle"
              checked={spectrumVisualEffects}
              onCheckedChange={setSpectrumVisualEffects}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
