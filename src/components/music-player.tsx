
"use client";

import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronUp,
  ChevronDown,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/hooks/use-app";
import AlbumArt from "./album-art";
import { useTheme } from "@/hooks/use-theme";

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
  
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

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
  
  const songColor = currentSong?.color || 'hsl(var(--primary))';

  const playerStyle = {
    '--song-color': songColor,
    '--song-color-contrast': 'white', // You might need a function to determine contrast
  } as React.CSSProperties;


  if (!currentSong) {
    return null;
  }

  if (expanded) {
    return (
       <div 
        style={playerStyle}
        className="fixed inset-0 bg-[--song-color] text-[--song-color-contrast] z-50 flex flex-col p-4"
       >
         <div className="flex justify-between items-center">
            <span className="text-sm font-bold uppercase">Now Playing</span>
            <Button variant="ghost" size="icon" onClick={() => setExpanded(false)} className="hover:bg-white/10">
              <ChevronDown />
            </Button>
         </div>
         <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <AlbumArt
                src={currentSong.album_art_url || currentSong.albumArt || ''}
                width={300}
                height={300}
                alt="Album Art"
                className="rounded-lg shadow-2xl aspect-square object-cover"
              />
            <div className="text-center">
                <h2 className="text-3xl font-bold">{currentSong.title}</h2>
                <p className="text-lg opacity-80">{currentSong.artist}</p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Slider 
                  value={[progress]} 
                  onValueChange={handleProgressChange} 
                  className="w-full [&>span:first-child]:bg-white/30 [&>span>span]:bg-white"
              />
               <div className="flex justify-between text-xs opacity-80">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
            </div>
             <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" className="hover:bg-white/10 h-16 w-16" onClick={playPrevious}><SkipBack className="h-8 w-8 fill-current" /></Button>
               <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 h-20 w-20 rounded-full" onClick={togglePlayPause}>{isPlaying ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current" />}</Button>
               <Button variant="ghost" size="icon" className="hover:bg-white/10 h-16 w-16" onClick={playNext}><SkipForward className="h-8 w-8 fill-current" /></Button>
            </div>
         </div>
       </div>
    )
  }

  return (
    <footer 
        style={playerStyle}
        className={cn(
            "bg-[--song-color] text-[--song-color-contrast] rounded-t-lg transition-all duration-300 p-2 shadow-2xl",
             currentSong ? "opacity-100" : "opacity-0"
        )}
    >
       <div className="flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(true)}>
          {/* Album Art */}
          <AlbumArt
            src={currentSong.album_art_url || currentSong.albumArt || ''}
            width={40}
            height={40}
            alt="Album Art"
            className="rounded-md aspect-square object-cover"
          />
           {/* Song Info */}
           <div className="text-left overflow-hidden flex-1">
              <p className="font-semibold truncate text-sm">{currentSong.title}</p>
          </div>
          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
                className="text-white bg-white/20 hover:bg-white/30 rounded-full h-8 w-8"
              >
                {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              </Button>
               <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hidden sm:flex"><Headphones className="h-5 w-5" /></Button>
          </div>
       </div>
       {/* Progress Bar */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            if(duration > 0){
              const newProgress = (clickX / rect.width) * 100;
              seek(newProgress);
            }
          }}
          className="relative h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer mt-2 group"
        >
          <div
            className="h-full bg-white transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
    </footer>
  );
}
