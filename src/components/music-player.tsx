
"use client";

import React from "react";
import ColorThief from "colorthief";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/hooks/use-app";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import AlbumArt from "./album-art";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";

export function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    direction,
  } = useApp();
  const [dominantColor, setDominantColor] = React.useState<string[]>([
    "#1F1F1F",
    "#333333",
  ]);

  React.useEffect(() => {
    if (currentSong?.album_art_url) {
      const imageUrl = currentSong.album_art_url;
       if (!imageUrl || typeof window === 'undefined') {
        setDominantColor(["#1F1F1F", "#333333"]);
        return;
      };

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;

      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(img, 2);
          if (palette && palette.length > 1) {
            const color1 = `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`;
            const color2 = `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`;
            setDominantColor([color1, color2]);
          } else {
            const color = colorThief.getColor(img);
            const singleColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            setDominantColor([singleColor, "#111"]);
          }
        } catch (e) {
          console.error("Error getting dominant color", e);
          setDominantColor(["#1F1F1F", "#333333"]);
        }
      };
      img.onerror = () => {
         setDominantColor(["#1F1F1F", "#333333"]);
      }
    } else {
       setDominantColor(["#1F1F1F", "#333333"]);
    }
  }, [currentSong]);


  const handlers = useSwipeable({
    onSwipedLeft: () => playNext(),
    onSwipedRight: () => playPrevious(),
    trackMouse: true,
  });

  if (!currentSong) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentSong.id}
        {...handlers}
        className="w-full max-w-md mx-auto p-3 rounded-2xl shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${dominantColor[0]}, ${dominantColor[1]})`,
        }}
        initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: direction < 0 ? 100 : -100, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Card className="bg-transparent border-none shadow-none">
          <CardContent className="flex items-center gap-3 p-0">
            <motion.div
              initial={{ rotate: -10, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AlbumArt
                src={currentSong.album_art_url || ""}
                alt={currentSong.title}
                width={64}
                height={64}
                className="w-16 h-16 rounded-xl shadow-md"
              />
            </motion.div>
            <div className="flex-1 flex flex-col text-white truncate">
              <span className="font-bold text-lg truncate">{currentSong.title}</span>
              <span className="text-sm opacity-80 truncate">{currentSong.artist}</span>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={playPrevious} className="text-white hover:bg-white/10 hover:text-white">
                <SkipBack />
              </Button>
              <Button variant="ghost" size="icon" onClick={togglePlayPause} className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white">
                {isPlaying ? <Pause /> : <Play />}
              </Button>
              <Button variant="ghost" size="icon" onClick={playNext} className="text-white hover:bg-white/10 hover:text-white">
                <SkipForward />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
