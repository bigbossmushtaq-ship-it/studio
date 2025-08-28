
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { useApp } from "@/hooks/use-app";
import AlbumArt from "./album-art";
import { Slider } from "./ui/slider";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

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

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => playNext(),
    onSwipedRight: () => playPrevious(),
    trackMouse: true,
  });

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!currentSong) return null;

  return (
    <motion.div
      key="full-player"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 35 }}
      className="fixed inset-0 flex flex-col items-center justify-center text-white bg-neutral-900/90 backdrop-blur-lg overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSong.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeIn" }}
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSong.album_art_url})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center gap-8 w-full px-8">
        <div {...swipeHandlers} className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSong.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <AlbumArt
                src={currentSong.album_art_url || ""}
                alt={currentSong.title}
                width={500}
                height={500}
                className="w-full aspect-square rounded-2xl shadow-2xl object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full max-w-sm text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSong.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold">{currentSong.title}</h2>
              <p className="text-lg text-white/70 mt-1">{currentSong.artist}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full max-w-sm space-y-2">
          <Slider
            min={0}
            max={100}
            value={[progress]}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white/70 font-mono">
            <span>{formatTime(duration * (progress / 100))}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={playPrevious}
            className="p-4 rounded-full text-white/80 hover:text-white transition-transform active:scale-90"
          >
            <SkipBack className="w-8 h-8 fill-current" />
          </button>
          <button
            onClick={togglePlayPause}
            className="p-5 rounded-full bg-white/90 hover:bg-white text-black transition-transform active:scale-90"
          >
            {isPlaying ? (
              <Pause className="w-10 h-10 fill-current" />
            ) : (
              <Play className="w-10 h-10 fill-current" />
            )}
          </button>
          <button
            onClick={playNext}
            className="p-4 rounded-full text-white/80 hover:text-white transition-transform active:scale-90"
          >
            <SkipForward className="w-8 h-8 fill-current" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
