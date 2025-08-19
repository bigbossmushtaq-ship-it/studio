
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
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/hooks/use-app";
import { useTheme } from "@/hooks/use-theme";


const SpectrumVisualizer = ({ isPlaying }: { isPlaying: boolean }) => {
  const [bars, setBars] = useState<number[]>([]);
  const { spectrumVisualEffects } = useTheme();

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isPlaying && spectrumVisualEffects) {
      intervalId = setInterval(() => {
        const newBars = Array.from({ length: 12 }, () => Math.random() * 0.9 + 0.1);
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
  }, [isPlaying, spectrumVisualEffects]);
  
  if (!spectrumVisualEffects) return null;

  return (
    <div className={cn("absolute inset-0 flex items-center justify-center w-full h-full pointer-events-none", isPlaying ? "opacity-100" : "opacity-0")}>
        <div className="flex h-full w-full items-end justify-center gap-1 pb-2">
          {bars.map((height, i) => (
            <div
              key={i}
              className="bg-primary/50 rounded-full"
              style={{
                height: `${height * 70 + 5}%`,
                width: "6%",
                transition: "all 0.1s ease-in-out",
                opacity: 0.7,
              }}
            ></div>
          ))}
        </div>
    </div>
  );
};


export function MusicPlayer() {
  const { isPlaying, setIsPlaying, setAudioRef } = useApp();
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
      if (audioRef.current) {
          setAudioRef(audioRef);
          audioRef.current.volume = 0.5;
      }
  }, [setAudioRef]);
  
  useEffect(() => {
    if(audioRef.current) {
      if(isPlaying) {
        audioRef.current.play().catch(e => console.error("Play error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying])

  return (
    <footer className="bg-card/80 backdrop-blur-lg border md:rounded-lg shadow-t-lg p-4">
      <audio ref={audioRef} src="/assets/m83-midnight-city.mp3" loop crossOrigin="anonymous" />
      <div className="flex items-center">
        {/* Left Side: Album Art & Song Info */}
        <div className="flex items-center gap-4 flex-1">
            <div className="relative h-14 w-14 flex-shrink-0">
               <Image
                src="https://placehold.co/128x128.png"
                width={56}
                height={56}
                alt="Album Art"
                className="rounded-md aspect-square object-cover"
                data-ai-hint="album cover"
              />
              <SpectrumVisualizer isPlaying={isPlaying} />
            </div>
             <div className="text-left overflow-hidden">
                <p className="font-semibold truncate">Midnight City</p>
                <p className="text-sm text-muted-foreground truncate">M83</p>
            </div>
        </div>

        {/* Right Side: Simplified Controls */}
        <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Laptop2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <PlusCircle className="h-6 w-6" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsPlaying(!isPlaying)}
            >
                {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 ml-1 fill-current" />}
            </Button>
        </div>
      </div>
      <div className="pt-2">
        <Slider defaultValue={[33]} max={100} step={1} />
      </div>
    </footer>
  );
}
