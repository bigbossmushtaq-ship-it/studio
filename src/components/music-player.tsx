
"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useApp } from "@/hooks/use-app";
import AlbumArt from "./album-art";
import { Slider } from "./ui/slider";
import { Play, Pause, SkipBack, SkipForward, ChevronDown, Music2 } from "lucide-react";
import ColorThief from "colorthief";
import { useSwipeable } from "react-swipeable";
import MiniPlayer from "./mini-player"; 
import FullPlayer from "./full-player";

export function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
  } = useApp();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [bgColor, setBgColor] = useState("#121212");
  const imgRef = useRef<HTMLImageElement>(null);

  const albumArtUrl = currentSong?.album_art_url || currentSong?.albumArt;

  useEffect(() => {
    if (albumArtUrl && imgRef.current) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = albumArtUrl;
        
        const extractColor = () => {
            try {
                const colorThief = new ColorThief();
                const result = colorThief.getColor(img);
                setBgColor(`rgb(${result[0]}, ${result[1]}, ${result[2]})`);
            } catch (err) {
                console.warn("ColorThief failed, using default background:", err);
                setBgColor("#121212");
            }
        };

        if (img.complete) {
             extractColor();
        } else {
            img.onload = extractColor;
        }
    } else {
        setBgColor("#121212");
    }
  }, [albumArtUrl]);


  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };
  
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => playNext(),
    onSwipedRight: () => playPrevious(),
    preventScrollOnSwipe: true,
    trackMouse: true
  });


  if (!currentSong) return null;

  return (
    <>
      <AnimatePresence>
       {!isExpanded && (
          <MiniPlayer 
            song={currentSong}
            isPlaying={isPlaying}
            bgColor={bgColor}
            onOpen={() => setIsExpanded(true)}
            onPlayPause={togglePlayPause}
            onNext={playNext}
            onPrev={playPrevious}
          />
       )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isExpanded && (
          <FullPlayer 
             song={currentSong}
             isPlaying={isPlaying}
             progress={progress}
             duration={duration}
             bgColor={bgColor}
             albumArtUrl={albumArtUrl}
             swipeHandlers={swipeHandlers}
             formatTime={formatTime}
             handleSeek={handleSeek}
             onClose={() => setIsExpanded(false)}
             onPlayPause={togglePlayPause}
             onNext={playNext}
             onPrev={playPrevious}
          />
        )}
      </AnimatePresence>
       {/* Hidden image for color extraction */}
      <img ref={imgRef} src={albumArtUrl} alt="hidden cover" className="hidden" />
    </>
  );
}
