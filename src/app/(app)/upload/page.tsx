
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2, File, Music } from "lucide-react";
import { suggestTheme } from '@/ai/flows/theme-suggestion';
import { suggestGenre } from '@/ai/flows/genre-suggestion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/lib/supabase";
import Image from 'next/image';
import { cn } from '@/lib/utils';

type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  theme: string;
  album_art_url: string;
  song_url: string;
};

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

  // Form State
  const [title, setTitle] = React.useState('');
  const [artist, setArtist] = React.useState('');
  const [album, setAlbum] = React.useState('');
  const [genre, setGenre] = React.useState('');
  const [theme, setTheme] = React.useState('');
  const [songFile, setSongFile] = React.useState<File | null>(null);
  const [albumArtFile, setAlbumArtFile] = React.useState<File | null>(null);
  const [errors, setErrors] = React.useState<FormErrors>({});
  
  // UI State
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSuggesting, setIsSuggesting] = React.useState(false);

  // Display State
  const [songs, setSongs] = React.useState<Song[]>([]);

  const fetchSongs = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSongs(data as Song[]);
    } catch (error) {
      console.error("Error fetching songs:", error);
      toast({
        variant: 'destructive',
        title: "Failed to load songs",
        description: "Could not retrieve the song library. Please try again later.",
      });
    }
  }, [toast]);

  React.useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);


  const handleSongFileChange = React.useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSongFile(file);
      setErrors(prev => ({...prev, songFile: false}));
      setIsSuggesting(true);
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const dataUri = e.target?.result as string;
          try {
            const [themeResult, genreResult] = await Promise.all([
              suggestTheme({ songDataUri: dataUri }),
              suggestGenre({ songDataUri: dataUri })
            ]);
            setTheme(themeResult.theme);
            setGenre(genreResult.genre);
            setErrors(p => ({...p, genre: false}));
          } catch (error) {
            console.error("Error suggesting theme or genre:", error);
            toast({
              variant: 'destructive',
              title: "Suggestion failed",
              description: "Could not analyze the song. Please enter theme and genre manually.",
            });
          } finally {
            setIsSuggesting(false);
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
        setIsSuggesting(false);
      }
    }
  }, [toast]);
  
  const handleAlbumArtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(file) {
      setAlbumArtFile(file);
      setErrors(prev => ({...prev, albumArtFile: false}));
    }
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

  const handleUpload = async () => {
    if (!validateForm() || !songFile || !albumArtFile) {
      toast({
        variant: 'destructive',
        title: "Missing Information",
        description: "Please fill out all highlighted fields.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const songPath = `public/${Date.now()}-${songFile.name}`;
      const albumArtPath = `public/${Date.now()}-${albumArtFile.name}`;

      // Upload song file
      const { error: songError } = await supabase.storage.from('songs').upload(songPath, songFile);
      if (songError) throw songError;
      const { data: { publicUrl: songUrl } } = supabase.storage.from('songs').getPublicUrl(songPath);

      // Upload album art
      const { error: albumArtError } = await supabase.storage.from('album-art').upload(albumArtPath, albumArtFile);
      if (albumArtError) throw albumArtError;
      const { data: { publicUrl: albumArtUrl } } = supabase.storage.from('album-art').getPublicUrl(albumArtPath);

      // Save metadata to Supabase table
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
        });
      
      if (insertError) throw insertError;
      
      toast({
        title: "Upload Successful!",
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
      fetchSongs();
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({
        variant: 'destructive',
        title: "Upload Failed",
        description: error.message || "There was an error uploading your song. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Song</CardTitle>
          <CardDescription>
            Add your own music to TuneFlow. It will appear below after upload.
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
            <div className="relative space-y-2">
              <Label htmlFor="genre" className={cn(errors.genre && "text-destructive")}>Genre (AI Suggested)</Label>
               <Input 
                id="genre" 
                placeholder={isSuggesting ? "Analyzing song..." : "e.g. Pop, Rock"} 
                value={genre}
                onChange={(e) => {setGenre(e.target.value); setErrors(p => ({...p, genre: false}))}}
                disabled={isSuggesting}
                className={cn(errors.genre && "border-destructive focus-visible:ring-destructive")}
              />
               {isSuggesting && <Loader2 className="absolute right-3 top-8 h-5 w-5 animate-spin" />}
            </div>
             <div className="relative space-y-2">
              <Label htmlFor="theme">Theme (AI Suggested)</Label>
              <Input 
                id="theme" 
                placeholder={isSuggesting ? "Analyzing song..." : "e.g. Energetic, Relaxing"} 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                disabled={isSuggesting}
              />
               {isSuggesting && <Loader2 className="absolute right-3 top-8 h-5 w-5 animate-spin" />}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={cn(errors.albumArtFile && "text-destructive")}>Album Art</Label>
              <label
                htmlFor="album-art-upload"
                className={cn("flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted", errors.albumArtFile && "border-destructive text-destructive")}
              >
                {albumArtFile ? (
                   <div className="flex flex-col items-center justify-center text-center">
                     <File className="w-8 h-8 mb-2 text-primary" />
                     <p className="font-semibold text-foreground truncate max-w-full px-4">{albumArtFile.name}</p>
                   </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <UploadCloud className="w-8 h-8 mb-2" />
                    <p className="text-sm">
                      <span className="font-semibold">Click to upload</span> or drag & drop
                    </p>
                  </div>
                )}
                <Input id="album-art-upload" type="file" className="hidden" accept="image/*" onChange={handleAlbumArtChange} />
              </label>
            </div>

            <div className="space-y-2">
              <Label className={cn(errors.songFile && "text-destructive")}>Song File</Label>
               <label
                  htmlFor="song-file-upload"
                  className={cn("flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted", errors.songFile && "border-destructive text-destructive")}
                >
                  {songFile ? (
                     <div className="flex flex-col items-center justify-center text-center">
                       <Music className="w-8 h-8 mb-2 text-primary" />
                       <p className="font-semibold text-foreground truncate max-w-full px-4">{songFile.name}</p>
                     </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <UploadCloud className="w-8 h-8 mb-2 " />
                      <p className="text-sm">
                        <span className="font-semibold">Click to upload</span> or drag & drop
                      </p>
                    </div>
                  )}
                  <Input id="song-file-upload" type="file" className="hidden" accept="audio/mpeg, audio/wav" onChange={handleSongFileChange} />
                </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleUpload} 
              disabled={isUploading || isSuggesting || !title || !artist || !album || !genre || !songFile || !albumArtFile}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Uploading...
                </>
              ) : 'Upload Song'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Uploaded Songs</h2>
        {songs.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {songs.map((song) => (
              <Card key={song.id} className="p-4 flex flex-col">
                <Image
                  src={song.album_art_url}
                  alt={song.title}
                  width={200}
                  height={200}
                  className="w-full h-auto aspect-square object-cover rounded-md mb-4"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold truncate">{song.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                </div>
                <audio controls src={song.song_url} className="mt-4 w-full" />
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No songs uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
