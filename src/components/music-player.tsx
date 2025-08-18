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
    let intervalId: NodeJS.Timeout | null = null;

    if (isPlaying) {
      intervalId = setInterval(() => {
        const newBars = Array.from({ length: 60 }, () => Math.random() * 0.9 + 0.1);
        setBars(newBars);
      }, 120);
    } else {
      setBars([]);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying]);

  return (
    <div className="absolute inset-0 flex items-center justify-center w-full h-full pointer-events-none">
        {bars.map((height, i) => {
          const angle = (i / bars.length) * 360;
          return (
            <div
              key={i}
              className="absolute h-full w-[4px] origin-bottom"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div
                className="bg-accent rounded-full"
                style={{
                  height: `${height * 25 + 5}%`,
                  width: "100%",
                  transform: `translateY(-160px)`,
                  transition: `all 0.1s ease-in-out`,
                  opacity: 0.7
                }}
              ></div>
            </div>
          );
        })}
    </div>
  );
};


export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <footer className="bg-player shadow-t-lg">
      <div className="grid grid-cols-[auto_1fr_auto] items-center px-4 h-24">
        {/* Left Side: Album Art & Song Info */}
        <div className="flex items-center gap-4 w-64">
            <div className="relative h-16 w-16 flex-shrink-0">
               <Image
                src="https://placehold.co/128x128.png"
                width={64}
                height={64}
                alt="Album Art"
                className="rounded-full aspect-square object-cover"
                data-ai-hint="album cover"
              />
              <SpectrumVisualizer isPlaying={isPlaying} />
            </div>
             <div className="text-left overflow-hidden">
                <p className="font-semibold truncate">Midnight City</p>
                <p className="text-sm text-muted-foreground truncate">M83</p>
            </div>
        </div>

        {/* Middle: Player Controls & Progress Bar */}
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-4">
                 <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                    <Shuffle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                    <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 ml-1 fill-current" />}
                </Button>
                <Button variant="ghost" size="icon">
                    <SkipForward className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                    <Repeat className="h-5 w-5" />
                </Button>
            </div>
             <div className="flex w-full max-w-md items-center gap-2">
                <span className="text-xs text-muted-foreground">1:21</span>
                <Slider defaultValue={[33]} max={100} step={1} className="w-full" />
                <span className="text-xs text-muted-foreground">4:04</span>
            </div>
        </div>
        
        {/* Right Side: Other Controls */}
        <div className="flex items-center justify-end gap-2 w-64">
          <Button variant="ghost" size="icon" onClick={() => setIsLiked(!isLiked)}>
            <Heart className={cn("h-5 w-5", isLiked && "fill-primary text-primary")} />
          </Button>
           <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-muted-foreground" />
                <Slider defaultValue={[50]} max={100} step={1} className="w-24" />
           </div>
        </div>
      </div>
    </footer>
  );
}
