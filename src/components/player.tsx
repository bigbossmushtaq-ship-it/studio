
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ColorThief from "colorthief";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronDown,
} from "lucide-react";
import { useSwipeable } from "react-swipeable";
import type { Song } from "@/lib/data";

interface PlayerProps {
  track: Song;
  onNext: () => void;
  onPrev: () => void;
}

export default function Player({ track, onNext, onPrev }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bgGradient, setBgGradient] = useState("from-gray-800 to-gray-900");
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Auto-play when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && track?.song_url) {
      audio.src = track.song_url;
      audio.load();
      audio.play().then(() => {
          setIsPlaying(true);
      }).catch(e => {
        console.error("Autoplay failed", e)
        setIsPlaying(false);
      });
    }
  }, [track]);

  // Extract dominant color
  useEffect(() => {
    if (!track?.album_art_url) {
      setBgGradient("from-gray-800 to-gray-900");
      return;
    }
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = track.album_art_url;
    img.onload = () => {
      const colorThief = new ColorThief();
      try {
        const color = colorThief.getColor(img);
        setBgGradient(`from-[rgb(${color[0]},${color[1]},${color[2]})] to-black`);
      } catch (error) {
        console.error("Failed to extract color from image:", error);
        setBgGradient("from-gray-800 to-gray-900");
      }
    };
    img.onerror = () => {
        console.error("Failed to load image for color extraction");
        setBgGradient("from-gray-800 to-gray-900");
    }
  }, [track]);

  // Progress bar and song end handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
         setProgress((audio.currentTime / audio.duration) * 100);
         setDuration(audio.duration);
      }
    };
    const handleSongEnd = () => {
      onNext();
    };
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleSongEnd);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleSongEnd);
    };
  }, [onNext]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const seekTime = (clickPosition / progressBar.offsetWidth) * audio.duration;
    audio.currentTime = seekTime;
  }
  
  const swipeHandlers = useSwipeable({
    onSwipedLeft: onNext,
    onSwipedRight: onPrev,
    preventScrollOnSwipe: true,
  });
  
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <motion.div
        {...swipeHandlers}
        className={`fixed bottom-[70px] md:bottom-0 left-0 right-0 p-4 bg-gradient-to-r ${bgGradient} shadow-lg cursor-pointer pointer-events-auto`}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        onClick={() => setIsFullScreen(true)}
      >
        <div className="flex items-center gap-4">
          <img
            src={track.album_art_url}
            alt={track.title}
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div className="flex-1 overflow-hidden">
            <h3 className="text-white text-sm font-semibold truncate">{track.title}</h3>
            <p className="text-gray-300 text-xs truncate">{track.artist}</p>
            <div className="relative w-full h-1 bg-gray-600 rounded-full mt-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleSeek(e); }}>
              <motion.div
                className="absolute top-0 left-0 h-1 bg-white rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent opening fullscreen
              togglePlay();
            }}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full flex-shrink-0"
          >
            {isPlaying ? (
              <Pause className="text-black w-5 h-5 fill-current" />
            ) : (
              <Play className="text-black w-5 h-5 fill-current" />
            )}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            className={`fixed inset-0 bg-gradient-to-b ${bgGradient} p-6 flex flex-col z-50`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <button
                onClick={() => setIsFullScreen(false)}
                className="text-white"
              >
                <ChevronDown size={28} />
              </button>
              <h2 className="text-white text-lg font-bold">Now Playing</h2>
              <div className="w-8" /> {/* spacer */}
            </div>

            <motion.img
              src={track.album_art_url}
              alt={track.title}
              className="w-full max-w-sm mx-auto aspect-square rounded-2xl shadow-xl mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
            />

            <div className="text-center flex-shrink-0">
                <h1 className="text-white text-2xl font-bold">
                {track.title}
                </h1>
                <p className="text-gray-300 text-md mb-6">
                {track.artist}
                </p>
            </div>
            
             <div className="w-full mb-2 flex-shrink-0 space-y-1">
                <div 
                    className="relative w-full h-2 bg-white/20 rounded-full cursor-pointer" 
                    onClick={handleSeek}>
                    <motion.div
                        className="absolute top-0 left-0 h-2 bg-white rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-white">
                    <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div className="flex justify-center items-center gap-6 mb-6 flex-shrink-0">
              <button onClick={onPrev}>
                <SkipBack className="text-white w-8 h-8 fill-current" />
              </button>
              <button
                onClick={togglePlay}
                className="w-16 h-16 flex items-center justify-center bg-white rounded-full"
              >
                {isPlaying ? (
                  <Pause className="text-black w-8 h-8 fill-current" />
                ) : (
                  <Play className="text-black w-8 h-8 fill-current" />
                )}
              </button>
              <button onClick={onNext}>
                <SkipForward className="text-white w-8 h-8 fill-current" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto text-white space-y-4">
              <div className="p-4 bg-black/30 rounded-xl">
                <h3 className="font-bold mb-2">About the Artist</h3>
                <p className="text-sm text-gray-300">
                  Artist details will go here (like Spotify profile info).
                </p>
              </div>
              <div className="p-4 bg-black/30 rounded-xl">
                <h3 className="font-bold mb-2">Lyrics</h3>
                <p className="text-sm text-gray-300">
                  Lyrics will appear here if available...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} onEnded={onNext}/>
    </>
  );
}
