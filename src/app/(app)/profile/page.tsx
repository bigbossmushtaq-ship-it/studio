
"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useApp } from "@/hooks/use-app";
import { supabase } from "@/lib/supabase";
import { Song } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import AlbumArt from "@/components/album-art";

function formatTime(seconds: number) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}


export default function ProfilePage() {
  const { user } = useApp();
  const { toast } = useToast();

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentSong = songs[currentIndex];

  useEffect(() => {
    const fetchUserSongs = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('songs')
          .select('*')
          .eq('uploaded_by', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSongs(data as Song[]);
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: "Failed to load your songs",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUserSongs();
  }, [user, toast]);


  const handleNext = useCallback(() => {
    if (songs.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
  }, [songs.length]);

  // Update progress bar
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    
    const handleSongEnd = () => {
        handleNext();
    }

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("ended", handleSongEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
      audio.removeEventListener("ended", handleSongEnd);
    };
  }, [handleNext]);


  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        toast({ variant: 'destructive', title: "Playback error", description: err.message });
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    if (songs.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = value[0];
    audio.currentTime = newTime;
    setProgress(newTime);
  };
  
  // Autoplay effect when index changes or user clicks play
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentSong) {
      if (audio.src !== (currentSong.song_url || '')) {
         audio.src = currentSong.song_url || '';
         audio.load();
      }
      
      if (isPlaying) {
        audio.play().catch(err => {
            console.error("Auto play error:", err);
            toast({ variant: 'destructive', title: "Playback error", description: err.message });
            setIsPlaying(false); // Set to false if autoplay fails
        });
      } else {
        audio.pause();
      }
    }
  }, [currentIndex, isPlaying, currentSong, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (songs.length === 0) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-center py-12 text-muted-foreground">
                <p>You haven't uploaded any songs yet.</p>
                <Button variant="link" asChild><a href="/upload">Upload your first song</a></Button>
            </div>
        </CardContent>
       </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
       <CardHeader>
          <CardTitle>My Music</CardTitle>
          <CardDescription>Listen to the songs you've uploaded.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
            <AlbumArt src={currentSong.album_art_url || ''} alt={currentSong.title} width={250} height={250} className="rounded-lg shadow-lg" />
            <div className="text-center">
                <h3 className="text-xl font-bold">{currentSong.title}</h3>
                <p className="text-muted-foreground">{currentSong.artist}</p>
            </div>
            
             <audio ref={audioRef} preload="auto" />

             <div className="w-full space-y-2">
                <Slider
                    min={0}
                    max={duration || 100}
                    value={[progress]}
                    onValueChange={handleSeek}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2">
                <Button onClick={handlePrev} variant="ghost" size="icon" disabled={songs.length < 2}><SkipBack className="w-6 h-6 fill-current" /></Button>
                <Button onClick={handlePlayPause} size="icon" className="w-16 h-16 rounded-full">
                    {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                </Button>
                <Button onClick={handleNext} variant="ghost" size="icon" disabled={songs.length < 2}><SkipForward className="w-6 h-6 fill-current" /></Button>
            </div>

        </CardContent>
    </Card>
  );
}
