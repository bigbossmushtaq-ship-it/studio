"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import ColorThief from "colorthief";
import type { Song } from "@/lib/data";
import { Play, Pause } from "lucide-react";
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

export default function MiniPlayer({
  song,
  onPlayPause,
  onNext,
  onPrev,
  onOpen,
  bgColor,
  setBgColor,
}: MiniPlayerProps) {
  const [didSwipe, setDidSwipe] = useState(false);

  // Extract blended colors from album art
  useEffect(() => {
    if (!song?.album_art_url) {
      setBgColor("linear-gradient(135deg, rgb(30,30,30), rgb(50,50,50))");
      return;
    };

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = song.album_art_url;

    const extractColors = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 5); // grab 5 dominant shades
        if (palette && palette.length >= 2) {
          const gradient = `linear-gradient(135deg, rgb(${palette[0].join(
            ","
          )}), rgb(${palette[1].join(",")}))`;
          setBgColor(gradient);
        } else {
          setBgColor("linear-gradient(135deg, rgb(30,30,30), rgb(50,50,50))");
        }
      } catch (err) {
        console.warn("Color extraction failed:", err);
        setBgColor("linear-gradient(135deg, rgb(30,30,30), rgb(50,50,50))");
      }
    };

    if (img.complete) {
      extractColors();
    } else {
      img.onload = extractColors;
    }
  }, [song?.album_art_url, setBgColor]);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setDidSwipe(true);
      onNext();
    },
    onSwipedRight: () => {
      setDidSwipe(true);
      onPrev();
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // Reset swipe state after each gesture
  useEffect(() => {
    if (didSwipe) {
      const timeout = setTimeout(() => setDidSwipe(false), 200); // Increased timeout slightly
      return () => clearTimeout(timeout);
    }
  }, [didSwipe]);

  if (!song) return null;

  return (
    <div
      {...handlers}
      onClick={() => {
        if (!didSwipe) {
          onOpen();
        }
      }}
      className="fixed bottom-20 md:bottom-4 left-2 right-2 md:left-auto md:w-96 rounded-2xl shadow-lg flex items-center justify-between p-3 cursor-pointer z-40"
      style={{
        background: bgColor,
        transition: "background 0.5s ease",
      }}
    >
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
        <p className="text-white font-semibold truncate text-sm">
          {song.title || "Unknown Song"}
        </p>
        <p className="text-gray-200 text-xs truncate">
          {song.artist || "Unknown Artist"}
        </p>
      </div>

      {/* Play / Pause */}
      <div className="flex items-center text-white">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlayPause();
          }}
          className="p-2 rounded-full hover:bg-white/10"
        >
          {song.isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current" />
          )}
        </button>
      </div>
    </div>
  );
}
