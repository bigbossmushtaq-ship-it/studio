
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2, File, Music } from "lucide-react";
import { suggestTheme } from '@/ai/flows/theme-suggestion';
import { useToast } from '@/hooks/use-toast';
import { db, storage } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from 'next/image';

type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  theme: string;
  albumArtUrl: string;
  songUrl: string;
};

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
  
  // UI State
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSuggestingTheme, setIsSuggestingTheme] = React.useState(false);

  // Display State
  const [songs, setSongs] = React.useState<Song[]>([]);

  const fetchSongs = React.useCallback(async () => {
    try {
      const q = query(collection(db, "songs"), orderBy("uploadedAt", "desc"));
      const snapshot = await getDocs(q);
      const songList = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Song, 'id'>) }));
      setSongs(songList);
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
      setAlbumArtFile(file);
    }
  }

  const handleUpload = async () => {
    if (!songFile || !albumArtFile || !title || !artist || !album || !genre || !theme) {
      toast({
        variant: 'destructive',
        title: "Missing Information",
        description: "Please fill out all fields and select both files.",
      });
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload song file
      const songRef = ref(storage, `songs/${Date.now()}-${songFile.name}`);
      await uploadBytes(songRef, songFile);
      const songUrl = await getDownloadURL(songRef);

      // 2. Upload album art
      const albumArtRef = ref(storage, `albumArt/${Date.now()}-${albumArtFile.name}`);
      await uploadBytes(albumArtRef, albumArtFile);
      const albumArtUrl = await getDownloadURL(albumArtRef);

      // 3. Save metadata to Firestore
      await addDoc(collection(db, "songs"), {
        title,
        artist,
        album,
        genre,
        theme,
        songUrl,
        albumArtUrl,
        uploadedAt: serverTimestamp(),
      });

      toast({
        title: "Upload Successful!",
        description: `${title} by ${artist} has been added to your library.`,
      });
      
      // 4. Reset form and refresh song list
      setTitle('');
      setArtist('');
      setAlbum('');
      setGenre('');
      setTheme('');
      setSongFile(null);
      setAlbumArtFile(null);
      fetchSongs();

    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        variant: 'destructive',
        title: "Upload Failed",
        description: "There was an error uploading your song. Please try again.",
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
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Enter song title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist">Artist</Label>
              <Input id="artist" placeholder="Enter artist name" value={artist} onChange={(e) => setArtist(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="album">Album</Label>
              <Input id="album" placeholder="Enter album name" value={album} onChange={(e) => setAlbum(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input id="genre" placeholder="Enter genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Album Art</Label>
              <label
                htmlFor="album-art-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
              >
                {albumArtFile ? (
                   <div className="flex flex-col items-center justify-center text-center">
                     <File className="w-8 h-8 mb-2 text-primary" />
                     <p className="font-semibold text-foreground truncate max-w-full px-4">{albumArtFile.name}</p>
                   </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag & drop
                    </p>
                  </div>
                )}
                <Input id="album-art-upload" type="file" className="hidden" accept="image/*" onChange={handleAlbumArtChange} />
              </label>
            </div>

            <div className="space-y-2">
              <Label>Song File</Label>
               <label
                  htmlFor="song-file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                >
                  {songFile ? (
                     <div className="flex flex-col items-center justify-center text-center">
                       <Music className="w-8 h-8 mb-2 text-primary" />
                       <p className="font-semibold text-foreground truncate max-w-full px-4">{songFile.name}</p>
                     </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag & drop
                      </p>
                    </div>
                  )}
                  <Input id="song-file-upload" type="file" className="hidden" accept="audio/mpeg, audio/wav" onChange={handleSongFileChange} />
                </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={isUploading || isSuggestingTheme}>
              {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : 'Upload Song'}
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
                  src={song.albumArtUrl}
                  alt={song.title}
                  width={200}
                  height={200}
                  className="w-full h-auto aspect-square object-cover rounded-md mb-4"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold truncate">{song.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                </div>
                <audio controls src={song.songUrl} className="mt-4 w-full" />
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

    