
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

  const albumArtUrl = currentSong?.album_art_url || currentSong?.albumArt;

  useEffect(() => {
    if (albumArtUrl && imgRef.current) {
        const img = imgRef.current;
        img.crossOrigin = "Anonymous";
        
        const extractColor = () => {
            if (!img) return;
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
          <motion.div
            {...swipeHandlers}
            onClick={() => setIsExpanded(true)}
            className="fixed bottom-20 md:bottom-2 left-2 right-2 rounded-2xl shadow-lg flex items-center justify-between p-3 cursor-pointer"
            style={{
              backgroundColor: bgColor,
              transition: "background-color 0.4s ease",
            }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
             <img
              ref={imgRef}
              src={albumArtUrl || "/default-album.png"}
              alt="cover"
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 ml-3 overflow-hidden">
                <p className="text-white font-semibold truncate text-sm">{currentSong.title}</p>
                <p className="text-gray-200 text-xs truncate">{currentSong.artist}</p>
            </div>
            <div className="flex items-center space-x-2 text-white">
                <button
                    onClick={(e) => { e.stopPropagation(); playPrevious(); }}
                    className="p-1 rounded-full text-white/80 hover:text-white transition-colors"
                >
                    <SkipBack className="w-5 h-5 fill-current" />
                </button>
                 <button
                    onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
                    className="p-2 rounded-full text-white transition-transform active:scale-90"
                 >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current"/> : <Play className="w-6 h-6 fill-current"/>}
                </button>
                 <button
                    onClick={(e) => { e.stopPropagation(); playNext(); }}
                    className="p-1 rounded-full text-white/80 hover:text-white transition-colors"
                 >
                    <SkipForward className="w-5 h-5 fill-current" />
                </button>
            </div>
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
                <img src={albumArtUrl} className="w-full h-full object-cover blur-2xl scale-125 opacity-30"/>
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
                src={albumArtUrl || ""}
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
