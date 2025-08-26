
"use client";

import React from "react";
import ColorThief from "colorthief";
import { useSwipeable } from "react-swipeable";
import { useApp } from "@/hooks/use-app";
import { Pause, Play } from "lucide-react";
import AlbumArt from "./album-art";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    progress,
    togglePlayPause,
    playNext,
    playPrevious,
  } = useApp();
  const [dominantColor, setDominantColor] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (currentSong?.album_art_url || currentSong?.albumArt) {
      const imageUrl = currentSong.album_art_url || currentSong.albumArt;
      if (!imageUrl || typeof window === 'undefined') return;

      const img = new Image();
      img.crossOrigin = "Anonymous"; // Required for cross-origin images
      img.src = imageUrl;

      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const color = colorThief.getColor(img);
          setDominantColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
        } catch (e) {
          console.error("Error getting dominant color", e);
          setDominantColor(null); // Fallback to primary
        }
      };
      img.onerror = () => {
         setDominantColor(null); // Fallback on image load error
      }
    } else {
       setDominantColor(null);
    }
  }, [currentSong]);

  const handlers = useSwipeable({
    onSwipedLeft: () => playNext(),
    onSwipedRight: () => playPrevious(),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  if (!currentSong) {
    return null;
  }

  return (
    <div
      {...handlers}
      className={cn(
        "bg-background/80 backdrop-blur-sm text-foreground p-3 rounded-t-lg shadow-lg"
      )}
    >
      <div className="flex items-center gap-3">
        <AlbumArt
          src={currentSong.album_art_url || currentSong.albumArt}
          alt={currentSong.title}
          width={48}
          height={48}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1 overflow-hidden">
          <h3 className="font-semibold truncate">{currentSong.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
        </div>
        <Button
          onClick={togglePlayPause}
          size="icon"
          className="p-3 bg-primary text-primary-foreground rounded-full shadow-lg h-12 w-12 flex-shrink-0"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
        </Button>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-2">
        <div
          className={cn("h-1.5 rounded-full", !dominantColor && "bg-primary")}
          style={{ width: `${progress}%`, backgroundColor: dominantColor || undefined }}
        />
      </div>
    </div>
  );
}
