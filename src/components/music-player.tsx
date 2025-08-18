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


const GeminiSpectrum = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(r => r + 1);
    }, 10);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 h-24 w-24 pointer-events-none">
       <div className="relative w-full h-full" style={{transform: `rotate(${rotation}deg)`}}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-8 bg-primary rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-8 bg-accent rounded-full" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-8 bg-blue-500 rounded-full" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-8 bg-green-500 rounded-full" />
      </div>
    </div>
  );
};


export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <footer className="relative z-10 border-t bg-card text-card-foreground shadow-lg">
      {isPlaying && <GeminiSpectrum />}
      <div className="grid h-24 grid-cols-3 items-center px-4">
        <div className="flex items-center gap-3">
          <Image
            src="https://placehold.co/64x64.png"
            width={64}
            height={64}
            alt="Album Art"
            className="rounded-md"
            data-ai-hint="album cover"
          />
          <div>
            <p className="font-semibold">Midnight City</p>
            <p className="text-sm text-muted-foreground">M83</p>
          </div>
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Shuffle className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Repeat className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          <div className="flex w-full max-w-md items-center gap-2">
            <span className="text-xs text-muted-foreground">1:21</span>
            <Slider
              defaultValue={[33]}
              max={100}
              step={1}
              className="w-full"
            />
            <span className="text-xs text-muted-foreground">4:04</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon">
            <Mic2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ListMusic className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Laptop2 className="h-5 w-5" />
          </Button>
          <div className="flex w-32 items-center gap-2">
            <Button variant="ghost" size="icon">
              <Volume2 className="h-5 w-5" />
            </Button>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
          <Button variant="ghost" size="icon">
            <Maximize2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
