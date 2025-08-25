
"use client";

import Image from "next/image";
import {
  Play,
  Pause,
  Laptop2,
  PlusCircle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/hooks/use-app";
import AlbumArt from "./album-art";

export function MusicPlayer() {
  const { 
    isPlaying, 
    currentSong, 
    progress,
    duration,
    seek,
    togglePlayPause,
    playNext,
    playPrevious,
  } = useApp();
  
  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    seek(newProgress);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress / 100) * duration;

  return (
    <footer className={cn("bg-card/95 backdrop-blur-lg rounded-md shadow-lg overflow-hidden transition-all duration-300", currentSong ? "h-auto p-2 opacity-100" : "h-0 p-0 opacity-0")}>
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
                onClick={playPrevious}
              >
                <SkipBack className="h-5 w-5 fill-current" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-foreground h-10 w-10"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 fill-current" />}
              </Button>
               <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-foreground h-10 w-10"
                onClick={playNext}
              >
                <SkipForward className="h-5 w-5 fill-current" />
              </Button>
            </div>
            <div className="w-full flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
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
