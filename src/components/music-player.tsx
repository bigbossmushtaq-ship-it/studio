
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/hooks/use-app";
import AlbumArt from "./album-art";
import { Slider } from "./ui/slider";
import { Play, Pause, SkipBack, SkipForward, ChevronDown } from "lucide-react";
import ColorThief from "colorthief";
import { useSwipeable } from "react-swipeable";

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

  useEffect(() => {
    if (currentSong && imgRef.current) {
        // Ensure the image is fully loaded, especially with crossOrigin
        imgRef.current.crossOrigin = "Anonymous";
        const extractColor = () => {
            if (!imgRef.current) return;
            try {
                const colorThief = new ColorThief();
                const result = colorThief.getColor(imgRef.current);
                setBgColor(`rgb(${result[0]}, ${result[1]}, ${result[2]})`);
            } catch (err) {
                console.warn("ColorThief failed, using default background:", err);
                setBgColor("#121212");
            }
        };

        if (imgRef.current.complete) {
             extractColor();
        } else {
            imgRef.current.onload = extractColor;
        }
    }
  }, [currentSong]);


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
          <motion.div
            key="mini-player"
            className="fixed bottom-16 md:bottom-2 left-0 right-0 p-3 z-50 text-white cursor-pointer shadow-lg mx-2 rounded-2xl flex items-center"
            onClick={() => setIsExpanded(true)}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
            style={{ backgroundColor: bgColor }}
            {...swipeHandlers}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
               <img
                ref={imgRef}
                src={currentSong.album_art_url || ""}
                alt="cover"
                crossOrigin="anonymous"
                className="w-12 h-12 rounded-lg"
              />
              <div className="truncate flex-1 ml-3 overflow-hidden cursor-pointer" onClick={() => setIsExpanded(true)}>
                <p className="text-white font-semibold truncate">{currentSong.title}</p>
                <p className="text-gray-300 text-sm truncate">{currentSong.artist}</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
              className="p-2 rounded-full text-white transition-transform active:scale-90"
            >
              {isPlaying ? <Pause className="w-8 h-8"/> : <Play className="w-8 h-8"/>}
            </button>
          </motion.div>
       )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="full-player"
            className="fixed inset-0 flex flex-col text-white z-50"
            style={{ backgroundColor: bgColor }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            {...swipeHandlers}
          >
             <div className="absolute inset-0 -z-10">
                <img src={currentSong.album_art_url} className="w-full h-full object-cover blur-2xl scale-125 opacity-30"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div
              className="p-4 cursor-pointer text-gray-200 flex items-center justify-center relative"
              onClick={() => setIsExpanded(false)}
            >
              <ChevronDown className="h-6 w-6 absolute left-4" />
              <p className="font-bold">Now Playing</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
               <AlbumArt
                src={currentSong.album_art_url || ""}
                alt={currentSong.title}
                width={500}
                height={500}
                className="w-full max-w-sm aspect-square rounded-2xl shadow-2xl object-cover"
              />
              <div className="text-center w-full max-w-sm">
                <h2 className="text-2xl font-bold">{currentSong.title}</h2>
                <p className="text-lg text-white/70 mt-1">{currentSong.artist}</p>
              </div>
            </div>
            
            <div className="p-6 w-full max-w-sm mx-auto">
               <div className="space-y-2">
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
              <div className="flex justify-center items-center space-x-6 mt-4">
                <button onClick={playPrevious}>
                  <SkipBack className="w-8 h-8 fill-current" />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="p-5 rounded-full bg-white/90 hover:bg-white text-black transition-transform active:scale-90"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 fill-current" />
                  ) : (
                    <Play className="w-10 h-10 fill-current ml-1" />
                  )}
                </button>
                <button onClick={playNext}>
                  <SkipForward className="w-8 h-8 fill-current" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
