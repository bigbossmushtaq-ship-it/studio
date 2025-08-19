
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const { theme, setTheme, spectrumVisualEffects, setSpectrumVisualEffects, customColors, setCustomColors } = useTheme();
  
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
          <CardTitle>Screen Customization</CardTitle>
          <CardDescription>
            Change the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">Theme</Label>
            <RadioGroup
              value={theme}
              onValueChange={setTheme}
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
               <div className="flex items-center space-x-2">
                <RadioGroupItem value="theme-custom" id="r4" />
                <Label htmlFor="r4">Custom</Label>
              </div>
            </RadioGroup>
          </div>
          {theme === 'theme-custom' && (
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <Label htmlFor="primary-color">Primary</Label>
                  <Input 
                    id="primary-color"
                    type="color" 
                    value={customColors.primary} 
                    onChange={(e) => setCustomColors({...customColors, primary: e.target.value})}
                    className="w-12 h-10 p-1"
                  />
                </div>
                 <div className="flex items-center gap-4">
                  <Label htmlFor="background-color">Background</Label>
                  <Input 
                    id="background-color"
                    type="color" 
                    value={customColors.background} 
                    onChange={(e) => setCustomColors({...customColors, background: e.target.value})}
                    className="w-12 h-10 p-1"
                  />
                </div>
                 <div className="flex items-center gap-4">
                  <Label htmlFor="accent-color">Accent</Label>
                  <Input 
                    id="accent-color"
                    type="color" 
                    value={customColors.accent} 
                    onChange={(e) => setCustomColors({...customColors, accent: e.target.value})}
                    className="w-12 h-10 p-1"
                  />
                </div>
             </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Playback</CardTitle>
          <CardDescription>
            Manage your audio and visual experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="visualizer-toggle">Enable Spectrum Visualizer</Label>
            <Switch
              id="visualizer-toggle"
              checked={spectrumVisualEffects}
              onCheckedChange={setSpectrumVisualEffects}
            />
          </div>
           <div className="flex items-center justify-between">
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
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Control how you receive updates from us.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-between">
            <Label htmlFor="notifications-toggle">Enable Push Notifications</Label>
            <Switch id="notifications-toggle" />
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
