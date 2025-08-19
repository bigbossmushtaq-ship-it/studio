
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
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
      if (audioRef.current) {
          setAudioRef(audioRef);
          audioRef.current.volume = volume;
          
          const setAudioData = () => {
            setDuration(audioRef.current?.duration || 0);
          }
          const setAudioTime = () => {
            setCurrentTime(audioRef.current?.currentTime || 0);
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

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if(audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    setProgress(newProgress);
     if(audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * duration;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }


  return (
    <footer className="bg-card/80 backdrop-blur-lg border md:rounded-lg shadow-t-lg px-4 py-2">
      <audio ref={audioRef} src="/assets/m83-midnight-city.mp3" loop crossOrigin="anonymous" />
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Left Side: Album Art & Song Info */}
        <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-12 w-12 flex-shrink-0">
               <Image
                src="https://placehold.co/128x128.png"
                width={48}
                height={48}
                alt="Album Art"
                className="rounded-md aspect-square object-cover"
                data-ai-hint="album cover"
              />
              <SpectrumVisualizer isPlaying={isPlaying} />
            </div>
             <div className="text-left overflow-hidden hidden sm:block">
                <p className="font-semibold truncate text-sm">Midnight City</p>
                <p className="text-xs text-muted-foreground truncate">M83</p>
            </div>
             <Button variant="ghost" size="icon" onClick={() => setIsLiked(!isLiked)} className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                <Heart className={cn("h-5 w-5", isLiked && "fill-primary text-primary")} />
             </Button>
        </div>

        {/* Center: Player Controls */}
         <div className="flex flex-col items-center gap-2">
           <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden lg:inline-flex">
                    <Shuffle className="h-5 w-5" />
                </Button>
                 <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                    <SkipBack className="h-5 w-5 fill-current" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground hover:text-foreground bg-primary/10 hover:bg-primary/20 h-10 w-10 rounded-full"
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 ml-1 fill-current" />}
                </Button>
                 <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                    <SkipForward className="h-5 w-5 fill-current" />
                </Button>
                 <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden lg:inline-flex">
                    <Repeat className="h-5 w-5" />
                </Button>
           </div>
           <div className="w-full max-w-xs items-center gap-2 hidden md:flex">
             <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
             <Slider value={[progress]} onValueChange={handleProgressChange} />
             <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
           </div>
        </div>

        {/* Right Side: Volume & Other Controls */}
        <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden lg:inline-flex">
                <Mic2 className="h-5 w-5" />
            </Button>
             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden lg:inline-flex">
                <ListMusic className="h-5 w-5" />
            </Button>
             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                <Laptop2 className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 w-24 hidden sm:inline-flex">
                <Volume2 className="h-5 w-5 text-muted-foreground" />
                <Slider value={[volume]} onValueChange={handleVolumeChange} max={1} step={0.05} />
            </div>
             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                <Maximize2 className="h-5 w-5" />
            </Button>
        </div>
      </div>
    </footer>
  );
}
