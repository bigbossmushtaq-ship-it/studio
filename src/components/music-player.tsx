
"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useApp } from "@/hooks/use-app";
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
  const [bgColor, setBgColor] = useState("rgb(30,30,30)");

  const albumArtUrl = currentSong?.album_art_url || currentSong?.albumArt;

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
            song={{...currentSong, isPlaying}}
            bgColor={bgColor}
            setBgColor={setBgColor}
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
    </>
  );
}
