
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
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useMusicPlayer } from "@/hooks/use-music-player";


const SpectrumVisualizer = ({ isPlaying }: { isPlaying: boolean }) => {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isPlaying) {
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
  }, [isPlaying]);

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
  const { isPlaying, setIsPlaying, setAudioRef } = useMusicPlayer();
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
    <footer className="bg-card/80 backdrop-blur-lg border md:rounded-lg shadow-t-lg">
      <audio ref={audioRef} src="/assets/m83-midnight-city.mp3" loop crossOrigin="anonymous" />
      <div className="grid grid-cols-[auto_1fr_auto] items-center px-4 h-20">
        {/* Left Side: Album Art & Song Info */}
        <div className="flex items-center gap-4 w-48 md:w-64">
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
             <div className="text-left overflow-hidden hidden md:block">
                <p className="font-semibold truncate">Midnight City</p>
                <p className="text-sm text-muted-foreground truncate">M83</p>
            </div>
        </div>

        {/* Middle: Player Controls & Progress Bar */}
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2 md:gap-4">
                 <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                    <Shuffle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
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
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <SkipForward className="h-5 w-5" />
                </Button>
                 <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                    <Repeat className="h-5 w-5" />
                </Button>
            </div>
             <div className="hidden md:flex w-full max-w-md items-center gap-2">
                <span className="text-xs text-muted-foreground">1:21</span>
                <Slider defaultValue={[33]} max={100} step={1} className="w-full" />
                <span className="text-xs text-muted-foreground">4:04</span>
            </div>
        </div>
        
        {/* Right Side: Other Controls */}
        <div className="flex items-center justify-end gap-2 w-48 md:w-64">
          <Button variant="ghost" size="icon" onClick={() => setIsLiked(prev => !prev)}>
            <Heart className={cn("h-5 w-5 text-muted-foreground", isLiked && "fill-primary text-primary")} />
          </Button>
           <div className="hidden md:flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-muted-foreground" />
                <Slider defaultValue={[50]} max={100} step={1} className="w-24" onChange={(value) => { if(audioRef.current) audioRef.current.volume = value[0] / 100 }}/>
           </div>
        </div>
      </div>
    </footer>
  );
}
