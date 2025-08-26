
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, X } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import { useApp } from "@/hooks/use-app";
import AlbumArt from "./album-art";
import { Slider } from "./ui/slider";

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
  const [expanded, setExpanded] = useState(false);
  
  const handleSeek = (value: number[]) => {
      seek(value[0]);
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => playNext(),
    onSwipedRight: () => playPrevious(),
    trackMouse: true,
  });
  
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-full w-full pointer-events-none flex justify-center">
      <AnimatePresence>
        {/* Mini Player */}
        {!expanded && (
          <motion.div
            key="mini-player"
            {...swipeHandlers}
            onClick={() => setExpanded(true)}
            className="fixed bottom-4 flex items-center gap-3 p-3 rounded-2xl w-[95%] max-w-md bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg cursor-pointer pointer-events-auto"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          >
            <AlbumArt
              src={currentSong.album_art_url || ""}
              alt={currentSong.title}
              width={56}
              height={56}
              className="w-14 h-14 rounded-xl flex-shrink-0"
            />
            <div className="flex-1 overflow-hidden">
              <h3 className="text-lg font-semibold truncate">{currentSong.title}</h3>
              <p className="text-sm text-gray-300 truncate">{currentSong.artist}</p>
              <div className="h-1 w-full bg-gray-600 rounded mt-1">
                <motion.div
                  className="h-1 rounded bg-teal-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
              className="p-2"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </button>
          </motion.div>
        )}

        {/* Full Player */}
        {expanded && (
          <motion.div
            key="full-player"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="fixed inset-0 bg-gradient-to-b from-gray-800 to-black flex flex-col items-center justify-center text-white p-6 pointer-events-auto"
          >
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-6 right-6 text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>

            <AlbumArt
              src={currentSong.album_art_url || ""}
              alt={currentSong.title}
              width={240}
              height={240}
              className="w-60 h-60 md:w-80 md:h-80 rounded-2xl mb-8 shadow-2xl"
            />
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold">{currentSong.title}</h2>
                <p className="text-lg text-gray-400 mt-1">{currentSong.artist}</p>
            </div>


            <div className="w-full max-w-md space-y-2">
               <Slider
                  value={[progress]}
                  onValueChange={handleSeek}
                  max={100}
                  step={0.1}
                />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>{formatTime(duration * (progress / 100))}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-8">
              <button
                onClick={playPrevious}
                className="p-4 rounded-full text-white/80 hover:text-white"
              >
                <SkipBack className="w-8 h-8 fill-current" />
              </button>
              <button
                onClick={togglePlayPause}
                className="p-5 rounded-full bg-teal-500 hover:bg-teal-400 text-black"
              >
                {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current" />}
              </button>
              <button
                onClick={playNext}
                className="p-4 rounded-full text-white/80 hover:text-white"
              >
                <SkipForward className="w-8 h-8 fill-current" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
