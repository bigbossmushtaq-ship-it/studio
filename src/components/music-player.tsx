
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, X } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import { useApp } from "@/hooks/use-app";
import AlbumArt from "./album-art";
import { Slider } from "./ui/slider";
import ColorThief from 'colorthief';

const colorThief = new ColorThief();

async function extractColor(url: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      try {
        const color = colorThief.getColor(img);
        resolve(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      } catch (e) {
        console.warn("Color extraction failed, falling back to default.", e);
        resolve('#111827'); // Fallback color
      }
    };
    img.onerror = () => {
      console.warn("Image could not be loaded for color extraction.");
      resolve('#111827'); // Fallback color
    }
  });
}

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
  const [bgColor, setBgColor] = useState<string>('#111827');

  useEffect(() => {
    if (!currentSong?.album_art_url) {
      setBgColor('#111827'); // Default color if no art
      return;
    };

    extractColor(currentSong.album_art_url).then(setBgColor);

  }, [currentSong]);
  
  const handleSeek = (value: number[]) => {
      seek(value[0]);
  }
  
  const handleTapProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    seek(newProgress);
  };

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
              className="w-14 h-14 rounded-xl flex-shrink-0 object-cover"
            />
            <div className="flex-1 overflow-hidden">
              <h3 className="text-lg font-semibold truncate">{currentSong.title}</h3>
              <p className="text-sm text-gray-300 truncate">{currentSong.artist}</p>
              <div className="h-1 w-full bg-gray-600 rounded mt-1">
                <motion.div
                  className="h-1 rounded"
                  style={{ backgroundColor: bgColor }}
                  animate={{ width: `${progress}%` }}
                   transition={{ ease: "linear", duration: 0.2 }}
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
        <AnimatePresence>
        {expanded && (
            <motion.div
                key="full-player"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 35 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(e, info) => {
                if (info.offset.y > 100) setExpanded(false);
                }}
                className="fixed inset-0 flex flex-col items-center justify-center text-white pointer-events-auto"
                style={{
                    background: `linear-gradient(to bottom, ${bgColor}, #000)`,
                }}
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
                    width={288}
                    height={288}
                    className="w-72 h-72 rounded-2xl mb-8 shadow-2xl object-cover"
                />
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold">{currentSong.title}</h2>
                    <p className="text-lg text-gray-400 mt-1">{currentSong.artist}</p>
                </div>


                 <div className="w-4/5 max-w-md space-y-2">
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

                <div className="flex items-center gap-6 mt-8">
                <button
                    onClick={playPrevious}
                    className="p-4 rounded-full text-white/80 hover:text-white"
                >
                    <SkipBack className="w-8 h-8 fill-current" />
                </button>
                <button
                    onClick={togglePlayPause}
                    className="p-5 rounded-full bg-white/90 hover:bg-white text-black"
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
