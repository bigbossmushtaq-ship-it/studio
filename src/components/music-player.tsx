

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
  const { isPlaying, setIsPlaying, setAudioRef } = useApp();
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
      if (audioRef.current) {
          setAudioRef(audioRef);
          audioRef.current.volume = volume;
          
          const setAudioData = () => {
            setDuration(audioRef.current?.duration || 0);
          }
          const setAudioTime = () => {
            setProgress(((audioRef.current?.currentTime || 0) / (audioRef.current?.duration || 1)) * 100);
          }

          audioRef.current.addEventListener('loadeddata', setAudioData);
          audioRef.current.addEventListener('timeupdate', setAudioTime);

          return () => {
            audioRef.current?.removeEventListener('loadeddata', setAudioData);
            audioRef.current?.removeEventListener('timeupdate', setAudioTime);
          }
      }
  }, [setAudioRef, volume]);
  
  useEffect(() => {
    if(audioRef.current) {
      if(isPlaying) {
        audioRef.current.play().catch(e => console.error("Play error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    setProgress(newProgress);
     if(audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * duration;
    }
  };


  return (
    <footer className="bg-card/95 backdrop-blur-lg rounded-md shadow-lg overflow-hidden">
      <audio ref={audioRef} src="/assets/m83-midnight-city.mp3" loop crossOrigin="anonymous" />
      <div className="flex items-center gap-4 p-2 relative">
        {/* Left Side: Album Art & Song Info */}
        <div className="flex items-center gap-3 min-w-0">
            <AlbumArt
              src="https://placehold.co/128x128.png"
              width={48}
              height={48}
              alt="Album Art"
              className="rounded-md aspect-square object-cover"
            />
             <div className="text-left overflow-hidden">
                <p className="font-semibold truncate text-sm">Salam</p>
                <p className="text-xs text-muted-foreground truncate">Yawar Abdal</p>
            </div>
        </div>

        {/* Right Side: Player Controls */}
         <div className="flex items-center gap-2 ml-auto">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Laptop2 className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <PlusCircle className="h-6 w-6" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground hover:text-foreground"
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {isPlaying ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 fill-current" />}
                </Button>
        </div>
        
         {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 px-2">
            <Slider 
                value={[progress]} 
                onValueChange={handleProgressChange} 
                className="w-full h-1 [&>span]:hidden"
            />
        </div>
      </div>
    </footer>
  );
}
