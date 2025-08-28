"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "./ui/slider";
import type { Song } from "@/lib/data";
import AlbumArt from "./album-art";

interface FullPlayerProps {
  song: Song & { isPlaying: boolean; progress: number; duration: number };
  isOpen: boolean;
  onClose: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (value: number) => void;
  bgColor: string;
}

function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function FullPlayer({
  song,
  isOpen,
  onClose,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  bgColor,
}: FullPlayerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
          className="fixed inset-0 z-50 flex flex-col p-4 text-white"
          style={{ background: bgColor }}
        >
          <div className="flex-shrink-0">
            <button onClick={onClose} className="p-2">
              <ChevronDown className="w-8 h-8" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-64 h-64 md:w-80 md:h-80"
            >
              <AlbumArt
                src={song.album_art_url || ""}
                alt="Album Art"
                width={320}
                height={320}
                className="rounded-xl shadow-2xl object-cover w-full h-full"
              />
            </motion.div>

            <div className="text-center">
              <h2 className="text-2xl font-bold">{song.title}</h2>
              <p className="text-lg opacity-70">{song.artist}</p>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-full max-w-md mx-auto space-y-4 pb-8">
             <div className="w-full space-y-2">
                <Slider
                    min={0}
                    max={song.duration || 100}
                    value={[song.progress]}
                    onValueChange={(value) => onSeek(value[0])}
                    className="w-full [&>span:last-child]:bg-white [&>span:last-child]:border-white"
                />
                <div className="flex justify-between text-xs text-white/70">
                    <span>{formatTime(song.progress)}</span>
                    <span>{formatTime(song.duration)}</span>
                </div>
            </div>
            
            <div className="flex items-center justify-center gap-6">
              <button onClick={onPrev}>
                <SkipBack className="w-8 h-8 fill-current" />
              </button>
              <button
                onClick={onPlayPause}
                className="bg-white text-black rounded-full p-4"
              >
                {song.isPlaying ? <Pause className="w-8 h-8 fill-current"/> : <Play className="w-8 h-8 fill-current"/>}
              </button>
              <button onClick={onNext}>
                <SkipForward className="w-8 h-8 fill-current" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
