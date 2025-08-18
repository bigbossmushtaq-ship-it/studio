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
import { useState } from "react";
import { cn } from "@/lib/utils";

const SpectrumBar = ({ height }: { height: number }) => (
  <div
    className="w-1 bg-accent transition-all duration-300 ease-in-out"
    style={{ height: `${height}px` }}
  />
);

const AudioSpectrum = () => {
  const [heights, setHeights] = useState([10, 20, 15, 25, 12, 18, 22, 14]);

  useState(() => {
    const interval = setInterval(() => {
      setHeights(heights.map(() => Math.random() * 25 + 5));
    }, 200);
    return () => clearInterval(interval);
  });

  return (
    <div className="absolute inset-x-0 bottom-full h-8 flex justify-center items-end gap-1 pointer-events-none">
      {heights.map((h, i) => (
        <SpectrumBar key={i} height={h} />
      ))}
    </div>
  );
};


export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <footer className="relative z-10 border-t bg-card text-card-foreground shadow-lg">
      <AudioSpectrum />
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
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
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
