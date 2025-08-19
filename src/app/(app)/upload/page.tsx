
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2, File } from "lucide-react";
import { suggestTheme } from '@/ai/flows/theme-suggestion';
import { useToast } from '@/hooks/use-toast';

export default function UploadPage() {
  const [theme, setTheme] = React.useState('');
  const [isSuggestingTheme, setIsSuggestingTheme] = React.useState(false);
  const [songFileName, setSongFileName] = React.useState<string | null>(null);
  const [albumArtFileName, setAlbumArtFileName] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleSongFileChange = React.useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSongFileName(file.name);
      setIsSuggestingTheme(true);
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const dataUri = e.target?.result as string;
          try {
            const result = await suggestTheme({ songDataUri: dataUri });
            setTheme(result.theme);
          } catch (error) {
            console.error("Error suggesting theme:", error);
            toast({
              variant: 'destructive',
              title: "Theme suggestion failed",
              description: "Could not analyze the song. Please enter a theme manually.",
            });
          } finally {
            setIsSuggestingTheme(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error reading file:", error);
        toast({
          variant: 'destructive',
          title: "File reading error",
          description: "There was a problem reading the selected file.",
        });
        setIsSuggestingTheme(false);
      }
    }
  }, [toast]);
  
  const handleAlbumArtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(file) {
      setAlbumArtFileName(file.name);
    }
  }


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upload Song</h2>
        <p className="text-muted-foreground">
          Add your own music to TuneFlow.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Song Details</CardTitle>
          <CardDescription>
            Fill out the information for the song you want to upload.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Enter song title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist">Artist</Label>
              <Input id="artist" placeholder="Enter artist name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="album">Album</Label>
              <Input id="album" placeholder="Enter album name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input id="genre" placeholder="Enter genre" />
            </div>
             <div className="relative space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Input 
                id="theme" 
                placeholder={isSuggestingTheme ? "Analyzing song..." : "e.g. Energetic, Relaxing"} 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                disabled={isSuggestingTheme}
              />
               {isSuggestingTheme && <Loader2 className="absolute right-3 top-8 h-5 w-5 animate-spin" />}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Album Art</Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="album-art-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
              >
                {albumArtFileName ? (
                   <div className="flex flex-col items-center justify-center text-center">
                     <File className="w-8 h-8 mb-4 text-primary" />
                     <p className="font-semibold text-foreground truncate max-w-full px-4">{albumArtFileName}</p>
                     <p className="text-xs text-muted-foreground mt-1">Click or drag to replace</p>
                   </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 800x800px)</p>
                  </div>
                )}
                <Input 
                  id="album-art-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAlbumArtChange} 
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Song File</Label>
             <div className="flex items-center justify-center w-full">
              <label
                htmlFor="song-file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
              >
                {songFileName ? (
                   <div className="flex flex-col items-center justify-center text-center">
                     <File className="w-8 h-8 mb-4 text-primary" />
                     <p className="font-semibold text-foreground truncate max-w-full px-4">{songFileName}</p>
                     <p className="text-xs text-muted-foreground mt-1">Click or drag to replace</p>
                   </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">MP3 or WAV (MAX. 10MB)</p>
                  </div>
                )}
                <Input 
                  id="song-file-upload" 
                  type="file" 
                  className="hidden" 
                  accept="audio/mpeg, audio/wav"
                  onChange={handleSongFileChange}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Upload Song</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
