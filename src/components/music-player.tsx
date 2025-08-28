"use client";

import React, { useState } from "react";
import { useApp } from "@/hooks/use-app";
import MiniPlayer from "./mini-player";
import FullPlayer from "./full-player";

export default function MusicPlayer() {
  const { currentSong, isPlaying, togglePlayPause, playNext, playPrev, progress, audioRef } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [bgColor, setBgColor] = useState("linear-gradient(135deg, #222, #444)");

  if (!currentSong) return null;

  const songWithStatus = {
    ...currentSong,
    isPlaying: isPlaying,
    progress: progress,
    duration: audioRef?.duration || 0,
  };
  
  const handleSeek = (newTime: number) => {
    if (audioRef) {
      audioRef.currentTime = newTime;
    }
  };

  return (
    <>
      <div className="pointer-events-auto">
        <MiniPlayer 
          song={songWithStatus}
          onPlayPause={togglePlayPause}
          onNext={playNext}
          onPrev={playPrev}
          onOpen={() => setIsExpanded(true)}
          bgColor={bgColor}
          setBgColor={setBgColor}
        />
      </div>
      <FullPlayer
        song={songWithStatus}
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        onPlayPause={togglePlayPause}
        onNext={playNext}
        onPrev={playPrev}
        onSeek={handleSeek}
        bgColor={bgColor}
      />
    </>
  );
}
