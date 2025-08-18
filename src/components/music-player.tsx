"use client";

import Image from "next/image";
import {
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Mic2,
  ListMusic,
  Laptop2,
  Volume2,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";


const SpectrumVisualizer = ({ isPlaying }: { isPlaying: boolean }) => {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const newBars = Array.from({ length: 12 }, () => Math.random() * 0.6 + 0.2);
        setBars(newBars);
      }, 150);
      return () => clearInterval(interval);
    } else {
      setBars([]);
    }
  }, [isPlaying]);

  return (
    <div className="absolute inset-0 flex items-center justify-center w-full h-full opacity-30">
      <div className="flex items-end h-full gap-px">
        {bars.map((height, i) => (
          <div
            key={i}
            className="bg-primary transition-all duration-150 ease-in-out"
            style={{ height: `${height * 100}%`, width: '4px' }}
          ></div>
        ))}
      </div>
    </div>
  );
};


export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <footer className="z-10 bg-player shadow-lg rounded-t-2xl m-2">
      <div className="grid grid-cols-3 items-center px-4 h-24">
        {/* Left Side: Album Art & Song Info */}
        <div className="flex items-center gap-3">
            <div className="relative h-16 w-16">
              <SpectrumVisualizer isPlaying={isPlaying} />
              <Image
                src="https://placehold.co/64x64.png"
                width={64}
                height={64}
                alt="Album Art"
                className="rounded-full aspect-square object-cover"
                data-ai-hint="album cover"
              />
            </div>
             <div className="text-left">
                <p className="font-semibold truncate">Midnight City</p>
                <p className="text-sm text-muted-foreground">M83</p>
            </div>
        </div>

        {/* Middle: Progress Bar */}
        <div className="flex w-full max-w-md items-center gap-2 mx-auto">
            <span className="text-xs text-muted-foreground">1:21</span>
            <Slider defaultValue={[33]} max={100} step={1} className="w-full" />
            <span className="text-xs text-muted-foreground">4:04</span>
        </div>
        
        {/* Right Side: Player Controls */}
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsLiked(!isLiked)}>
            <Heart className={cn("h-5 w-5", isLiked && "fill-primary text-primary")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current" />}
          </Button>
           <Button variant="ghost" size="icon">
              <SkipForward className="h-5 w-5" />
            </Button>
        </div>
      </div>
    </footer>
  );
}
