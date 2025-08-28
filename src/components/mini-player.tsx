
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import ColorThief from "colorthief";
import type { Song } from "@/lib/data";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import AlbumArt from "./album-art";

interface MiniPlayerProps {
  song: Song & { isPlaying: boolean };
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onOpen: () => void;
  bgColor: string;
  setBgColor: (color: string) => void;
}

export default function MiniPlayer({ song, onPlayPause, onNext, onPrev, onOpen, bgColor, setBgColor }: MiniPlayerProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Extract dominant color
  useEffect(() => {
    if (!imgRef.current || !song?.album_art_url) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = song.album_art_url;
    
    const extractColor = () => {
      try {
        const colorThief = new ColorThief();
        const result = colorThief.getColor(img);
        setBgColor(`rgb(${result[0]},${result[1]},${result[2]})`);
      } catch (err) {
        console.warn("Color extraction failed:", err);
        setBgColor("rgb(30,30,30)");
      }
    };
    
    if (img.complete) {
        extractColor();
    } else {
        img.onload = extractColor;
    }
  }, [song?.album_art_url, setBgColor]);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => onNext(),
    onSwipedRight: () => onPrev(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  if (!song) return null;

  return (
    <div
      {...handlers}
      onClick={onOpen}
      className="fixed bottom-20 md:bottom-4 left-2 right-2 md:left-auto md:w-96 rounded-2xl shadow-lg flex items-center justify-between p-3 cursor-pointer z-40"
      style={{
        backgroundColor: bgColor,
        transition: "background-color 0.4s ease",
      }}
    >
        {/* Hidden image for color extraction */}
      <img ref={imgRef} src={song.album_art_url} alt="hidden cover" className="hidden" />

      {/* Cover */}
      <AlbumArt
        src={song.album_art_url || ""}
        alt="cover"
        width={48}
        height={48}
        className="w-12 h-12 rounded-lg object-cover"
      />

      {/* Song Info */}
      <div className="flex-1 ml-3 overflow-hidden">
        <p className="text-white font-semibold truncate text-sm">{song.title || "Unknown Song"}</p>
        <p className="text-gray-200 text-xs truncate">{song.artist || "Unknown Artist"}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2 text-white">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="p-2 rounded-full hover:bg-white/10"
        >
          <SkipBack className="w-5 h-5 fill-current" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlayPause();
          }}
          className="p-2 rounded-full hover:bg-white/10"
        >
          {song.isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="p-2 rounded-full hover:bg-white/10"
        >
          <SkipForward className="w-5 h-5 fill-current" />
        </button>
      </div>
    </div>
  );
}
