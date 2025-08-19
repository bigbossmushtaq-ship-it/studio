
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/use-theme";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

export default function CustomizationSettingsPage() {
  const { theme, setTheme, customColors, setCustomColors } = useTheme();
  
  return (
      <Card>
        <CardHeader>
          <CardTitle>Screen Customization</CardTitle>
          <CardDescription>
            Change the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
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
             <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label htmlFor="primary-color">Primary</Label>
                  <Input 
                    id="primary-color"
                    type="color" 
                    value={customColors.primary} 
                    onChange={(e) => setCustomColors({...customColors, primary: e.target.value})}
                    className="w-12 h-10 p-1"
                  />
                </div>
                 <div className="flex items-center justify-between">
                  <Label htmlFor="background-color">Background</Label>
                  <Input 
                    id="background-color"
                    type="color" 
                    value={customColors.background} 
                    onChange={(e) => setCustomColors({...customColors, background: e.target.value})}
                    className="w-12 h-10 p-1"
                  />
                </div>
                 <div className="flex items-center justify-between">
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
  )
}
