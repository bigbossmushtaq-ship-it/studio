
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2, CheckCircle2, Wand2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/lib/supabase";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useApp } from '@/hooks/use-app';
import { suggestGenre } from '@/ai/flows/genre-suggestion';
import { suggestTheme } from '@/ai/flows/theme-suggestion';
import { v4 as uuidv4 } from 'uuid';
import AlbumArt from '@/components/album-art';

type FormErrors = {
  title?: boolean;
  artist?: boolean;
  album?: boolean;
  genre?: boolean;
  songFile?: boolean;
  albumArtFile?: boolean;
}

export default function UploadPage() {
  const { toast } = useToast();
  const { user } = useApp();

  // Form State
  const [title, setTitle] = React.useState('');
  const [artist, setArtist] = React.useState('');
  const [album, setAlbum] = React.useState('');
  const [genre, setGenre] = React.useState('');
  const [theme, setTheme] = React.useState('');
  const [errors, setErrors] = React.useState<FormErrors>({});
  
  // File State
  const [songFile, setSongFile] = React.useState<File | null>(null);
  const [albumArtFile, setAlbumArtFile] = React.useState<File | null>(null);

  // UI State
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSuggestingGenre, setIsSuggestingGenre] = React.useState(false);
  const [isSuggestingTheme, setIsSuggestingTheme] = React.useState(false);

  const handleSongFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSongFile(file);
    setErrors(p => ({...p, songFile: false}));
  };
  
  const handleAlbumArtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(!file) return;
    setAlbumArtFile(file);
    setErrors(p => ({...p, albumArtFile: false}));
  }

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!title) newErrors.title = true;
    if (!artist) newErrors.artist = true;
    if (!album) newErrors.album = true;
    if (!genre) newErrors.genre = true;
    if (!songFile) newErrors.songFile = true;
    if (!albumArtFile) newErrors.albumArtFile = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  
  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSuggestGenre = async () => {
    if (!songFile) {
      toast({ variant: 'destructive', title: 'Please select a song file first.' });
      return;
    }
    setIsSuggestingGenre(true);
    try {
      const songDataUri = await fileToDataUri(songFile);
      const result = await suggestGenre({ songDataUri });
      setGenre(result.genre);
    } catch (error) {
      console.error('Genre suggestion failed:', error);
      toast({ variant: 'destructive', title: 'Could not suggest a genre.' });
    } finally {
      setIsSuggestingGenre(false);
    }
  };

  const handleSuggestTheme = async () => {
    if (!songFile) {
      toast({ variant: 'destructive', title: 'Please select a song file first.' });
      return;
    }
    setIsSuggestingTheme(true);
    try {
      const songDataUri = await fileToDataUri(songFile);
      const result = await suggestTheme({ songDataUri });
      setTheme(result.theme);
    } catch (error) {
      console.error('Theme suggestion failed:', error);
      toast({ variant: 'destructive', title: 'Could not suggest a theme.' });
    } finally {
      setIsSuggestingTheme(false);
    }
  };


  const handleSaveSong = async () => {
    if (!validateForm() || !songFile || !albumArtFile || !user) {
      toast({
        variant: 'destructive',
        title: "Missing Information",
        description: "Please fill out all required fields and select both files.",
      });
      return;
    }

    setIsSaving(true);

    try {
      // 1. Upload Album Art
      const albumArtPath = `public/${uuidv4()}`;
      const { error: albumArtError } = await supabase.storage
        .from('album-art')
        .upload(albumArtPath, albumArtFile);
      if (albumArtError) throw new Error(`Album Art Upload Failed: ${albumArtError.message}`);
      const { data: { publicUrl: albumArtUrl } } = supabase.storage.from('album-art').getPublicUrl(albumArtPath);
      if (!albumArtUrl) throw new Error('Could not get public URL for album art.');

      // 2. Upload Song File
      const songPath = `public/${uuidv4()}`;
      const { data: songUploadData, error: songError } = await supabase.storage
        .from('music')
        .upload(songPath, songFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: songFile.type,
        });

      if (songError) throw new Error(`Song Upload Failed: ${songError.message}`);
      const { data: { publicUrl: songUrl } } = supabase.storage.from('music').getPublicUrl(songPath);
       if (!songUrl) throw new Error('Could not get public URL for song.');


      // 3. Save metadata to database
      const { error: insertError } = await supabase
        .from('songs')
        .insert({
          title,
          artist,
          album,
          genre,
          theme: theme || 'Not specified',
          song_url: songUrl,
          album_art_url: albumArtUrl,
          uploaded_by: user.id
        });
      
      if (insertError) throw new Error(`Database Save Failed: ${insertError.message}`);
      
      toast({
        title: "Save Successful!",
        description: `${title} by ${artist} has been added to your library.`,
      });

      // Reset form
      setTitle('');
      setArtist('');
      setAlbum('');
      setGenre('');
      setTheme('');
      setSongFile(null);
      setAlbumArtFile(null);
      setErrors({});
    } catch (error: any) {
      console.error("Save failed:", error);
      toast({
        variant: 'destructive',
        title: "Save Failed",
        description: error.message || "There was an error saving your song. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Song</CardTitle>
          <CardDescription>
            Add your own music to TuneFlow. It will appear on the home page after upload. Use the magic wand to get AI-powered suggestions for genre and theme based on the audio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className={cn(errors.title && "text-destructive")}>Title</Label>
              <Input id="title" placeholder="Enter song title" value={title} onChange={(e) => {setTitle(e.target.value); setErrors(p => ({...p, title: false}))}} className={cn(errors.title && "border-destructive focus-visible:ring-destructive")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist" className={cn(errors.artist && "text-destructive")}>Artist</Label>
              <Input id="artist" placeholder="Enter artist name" value={artist} onChange={(e) => {setArtist(e.target.value); setErrors(p => ({...p, artist: false}))}} className={cn(errors.artist && "border-destructive focus-visible:ring-destructive")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="album" className={cn(errors.album && "text-destructive")}>Album</Label>
              <Input id="album" placeholder="Enter album name" value={album} onChange={(e) => {setAlbum(e.target.value); setErrors(p => ({...p, album: false}))}} className={cn(errors.album && "border-destructive focus-visible:ring-destructive")}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre" className={cn(errors.genre && "text-destructive")}>Genre</Label>
               <div className="flex gap-2">
                  <Input 
                    id="genre" 
                    placeholder="e.g. Pop, Rock" 
                    value={genre}
                    onChange={(e) => {setGenre(e.target.value); setErrors(p => ({...p, genre: false}))}}
                    className={cn(errors.genre && "border-destructive focus-visible:ring-destructive")}
                  />
                  <Button variant="outline" size="icon" onClick={handleSuggestGenre} disabled={isSuggestingGenre || !songFile}>
                    {isSuggestingGenre ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  </Button>
               </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="theme">Theme (Optional)</Label>
               <div className="flex gap-2">
                <Input 
                  id="theme" 
                  placeholder="e.g. Energetic, Relaxing" 
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                />
                <Button variant="outline" size="icon" onClick={handleSuggestTheme} disabled={isSuggestingTheme || !songFile}>
                   {isSuggestingTheme ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={cn(errors.albumArtFile && "text-destructive")}>Album Art</Label>
              <label
                htmlFor="album-art-upload"
                className={cn("flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted", errors.albumArtFile && "border-destructive text-destructive", isSaving && "cursor-not-allowed", albumArtFile && "border-green-500")}
              >
                {albumArtFile ? 
                  <div className="flex flex-col items-center justify-center text-center"><CheckCircle2 className="w-8 h-8 mb-2 text-green-500" /><p className="font-semibold text-foreground truncate max-w-full px-4">{albumArtFile.name}</p></div> :
                  <div className="flex flex-col items-center justify-center"><UploadCloud className="w-8 h-8 mb-2" /><p className="text-sm"><span className="font-semibold">Click to upload</span> or drag & drop</p></div>
                }
                <Input id="album-art-upload" type="file" className="hidden" accept="image/*" onChange={handleAlbumArtChange} disabled={isSaving} />
              </label>
            </div>

            <div className="space-y-2">
              <Label className={cn(errors.songFile && "text-destructive")}>Song File</Label>
               <label
                  htmlFor="song-file-upload"
                  className={cn("flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted", errors.songFile && "border-destructive text-destructive", isSaving && "cursor-not-allowed", songFile && "border-green-500")}
                >
                  {songFile ? 
                    <div className="flex flex-col items-center justify-center text-center"><CheckCircle2 className="w-8 h-8 mb-2 text-green-500" /><p className="font-semibold text-foreground truncate max-w-full px-4">{songFile.name}</p></div> :
                    <div className="flex flex-col items-center justify-center"><UploadCloud className="w-8 h-8 mb-2" /><p className="text-sm"><span className="font-semibold">Click to upload</span> or drag & drop</p></div>
                  }
                  <Input id="song-file-upload" type="file" className="hidden" accept="audio/mpeg, audio/wav" onChange={handleSongFileChange} disabled={isSaving} />
                </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSaveSong} 
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Saving...
                </>
              ) : 'Save Song to Library'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
