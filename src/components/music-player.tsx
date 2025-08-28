
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { useApp } from "@/hooks/use-app";
import AlbumArt from "./album-art";
import { Slider } from "./ui/slider";
import { Play, Pause, SkipBack, SkipForward, ChevronsDown } from "lucide-react";

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

  const handleSeek = (value: number[]) => {
      seek(value[0]);
  }
  
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => playNext(),
    onSwipedRight: () => playPrevious(),
    trackMouse: true,
  });
  
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentSong) return null;

  return (
    <>
      <AnimatePresence>
        {!isExpanded ? (
          <motion.div
            key="mini-player"
            {...swipeHandlers}
            onClick={() => setIsExpanded(true)}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 rounded-2xl w-[95%] max-w-md text-white shadow-lg cursor-pointer bg-neutral-900/80 backdrop-blur-sm"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
              <div className="h-1 w-full bg-white/20 rounded mt-1">
                <motion.div
                  className="h-1 rounded bg-white"
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
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
            </button>
          </motion.div>
        ) : (
            <motion.div
                key="full-player"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 35 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.y > 100) setIsExpanded(false);
                }}
                className="fixed inset-0 flex flex-col items-center justify-center text-white bg-neutral-900/90 backdrop-blur-lg overflow-hidden"
            >
                <button
                    onClick={() => setIsExpanded(false)}
                    className="absolute top-6 right-6 text-gray-300 z-10"
                >
                    <ChevronsDown className="w-8 h-8" />
                </button>
                
                 <div className="relative flex-1 flex flex-col items-center justify-center gap-8 w-full px-8">
                    <div 
                        {...swipeHandlers}
                        className="w-full max-w-sm"
                    >
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
                            {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current" />}
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
        )}
      </AnimatePresence>
    </>
  );
}
