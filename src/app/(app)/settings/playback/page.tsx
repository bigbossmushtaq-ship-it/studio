
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PlaybackSettingsPage() {
  const { spectrumVisualEffects, setSpectrumVisualEffects } = useTheme();
  
  return (
      <Card>
        <CardHeader>
          <CardTitle>Playback</CardTitle>
          <CardDescription>
            Manage your audio and visual experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="visualizer-toggle">Enable Spectrum Visualizer</Label>
            <div className="flex items-center">
              <Switch
                id="visualizer-toggle"
                checked={spectrumVisualEffects}
                onCheckedChange={setSpectrumVisualEffects}
              />
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="audio-quality">Audio Quality</Label>
             <Select defaultValue="normal">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
          </div>
        </CardContent>
      </Card>
  )
}
