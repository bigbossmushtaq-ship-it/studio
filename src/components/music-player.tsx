
"use client";

import React from "react";
import ColorThief from "colorthief";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/hooks/use-app";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
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
    direction,
  } = useApp();
  const [dominantColor, setDominantColor] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    if (currentSong?.album_art_url) {
      const imageUrl = currentSong.album_art_url;
      if (!imageUrl || typeof window === 'undefined') {
        setDominantColor(null);
        return;
      };

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;

      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const color = colorThief.getColor(img);
          setDominantColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
        } catch (e) {
          console.error("Error getting dominant color", e);
          setDominantColor(null);
        }
      };
      img.onerror = () => {
         setDominantColor(null);
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

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    }),
  };

  if (!currentSong) {
    return null;
  }

  const handleDragEnd = (_: any, info: { offset: { x: any; }; }) => {
    if (info.offset.x > 80) {
      playPrevious();
    } else if (info.offset.x < -80) {
      playNext();
    }
  };

  return (
    <div
      {...handlers}
      className={cn(
        "bg-background/80 backdrop-blur-sm text-foreground p-3 rounded-lg shadow-lg overflow-hidden h-24 flex flex-col justify-center"
      )}
      style={{
        background: dominantColor ? `linear-gradient(135deg, ${dominantColor}, #0a0a0a)` : undefined,
      }}
    >
      <div className="flex items-center gap-4 w-full">
        <AlbumArt
          src={currentSong.album_art_url || currentSong.albumArt}
          alt={currentSong.title}
          width={56}
          height={56}
          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
        />

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="overflow-hidden flex-1"
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentSong.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="whitespace-nowrap"
            >
              <h3 className="font-semibold truncate">{currentSong.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="flex items-center gap-1 flex-shrink-0">
            <Button onClick={playPrevious} variant="ghost" size="icon" className="w-8 h-8">
              <SkipBack className="w-5 h-5 fill-current" />
            </Button>
            <Button onClick={togglePlayPause} variant="ghost" size="icon" className="w-8 h-8">
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </Button>
            <Button onClick={playNext} variant="ghost" size="icon" className="w-8 h-8">
              <SkipForward className="w-5 h-5 fill-current" />
            </Button>
        </div>
      </div>
      
      <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mt-auto absolute bottom-3 left-3 right-3">
        <div
          className={cn("h-1.5 rounded-full", !dominantColor && "bg-primary")}
          style={{ width: `${progress}%`, backgroundColor: dominantColor || undefined }}
        />
      </div>
    </div>
  );
}
