
"use client";

import Image from "next/image";
import {
  Play,
  Pause,
  Laptop2,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/hooks/use-app";
import AlbumArt from "./album-art";

export function MusicPlayer() {
  const { isPlaying, setIsPlaying, setAudioRef, currentSong } = useApp();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      setAudioRef(audioRef);
      
      const setAudioData = () => {
        setDuration(audioRef.current?.duration || 0);
      }
      const setAudioTime = () => {
        const currentProgress = ((audioRef.current?.currentTime || 0) / (audioRef.current?.duration || 1)) * 100;
        setProgress(currentProgress);
      }

      const audio = audioRef.current;
      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', () => setIsPlaying(false));


      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', () => setIsPlaying(false));
      }
    }
  }, [setAudioRef, setIsPlaying]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
       const url = currentSong.song_url || currentSong.fileUrl;
       if (audioRef.current.src !== url) {
          audioRef.current.src = url || '';
          setProgress(0);
          audioRef.current.load();
       }
    }
  }, [currentSong]);
  
  useEffect(() => {
    if(audioRef.current) {
      if(isPlaying) {
        audioRef.current.play().catch(e => console.error("Play error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]); // Re-run when currentSong changes too

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    setProgress(newProgress);
     if(audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * duration;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <footer className={cn("bg-card/95 backdrop-blur-lg rounded-md shadow-lg overflow-hidden transition-all duration-300", currentSong ? "h-auto p-2 opacity-100" : "h-0 p-0 opacity-0")}>
       <audio ref={audioRef} crossOrigin="anonymous" />
       {currentSong && (
        <div className="flex items-center gap-4 relative">
          {/* Left Side: Album Art & Song Info */}
          <div className="flex items-center gap-3 min-w-0">
              <AlbumArt
                src={currentSong.album_art_url || currentSong.albumArt || ''}
                width={48}
                height={48}
                alt="Album Art"
                className="rounded-md aspect-square object-cover"
              />
               <div className="text-left overflow-hidden">
                  <p className="font-semibold truncate text-sm">{currentSong.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
              </div>
          </div>

          {/* Center: Player Controls & Progress */}
          <div className="flex-1 flex flex-col items-center gap-1 mx-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-foreground h-10 w-10"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 fill-current" />}
              </Button>
            </div>
            <div className="w-full flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{formatTime(audioRef.current?.currentTime || 0)}</span>
              <Slider 
                  value={[progress]} 
                  onValueChange={handleProgressChange} 
                  className="w-full h-1"
              />
              <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
            </div>
          </div>


          {/* Right Side: Other Controls */}
           <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <Laptop2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <PlusCircle className="h-5 w-5" />
                  </Button>
          </div>
        </div>
      )}
    </footer>
  );
}
