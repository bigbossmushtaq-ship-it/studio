
"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ColorThief from "colorthief";

const songs = [
  {
    title: "Test_10",
    artist: "Test_8",
    album_art_url: "https://i.scdn.co/image/ab67616d0000b2736b0f4bfc27c71cf1f3f2b1f6",
    src: "https://storage.googleapis.com/studioprod-project-filesystem-uploads/2024-05-24T18:27:07.135Z-test10.mp3",
  },
  {
    title: "Test_9",
    artist: "Test_7",
    album_art_url: "https://i.scdn.co/image/ab67616d0000b27347a7c58f52e2189e50c42e08",
    src: "https://storage.googleapis.com/studioprod-project-filesystem-uploads/2024-05-24T18:27:07.140Z-test9.mp3",
  },
];

export default function MiniPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgGradient, setBgGradient] = useState("linear-gradient(to right, #000, #333)");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Extract gradient from album art
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    img.crossOrigin = "Anonymous";
    const handleLoad = () => {
      const colorThief = new ColorThief();
      try {
        const palette = colorThief.getPalette(img, 2);
        if (palette && palette.length >= 2) {
          setBgGradient(
            `linear-gradient(to right, rgb(${palette[0].join(",")}), rgb(${palette[1].join(",")}))`
          );
        }
      } catch (err) {
        console.error("ColorThief failed:", err);
      }
    };
    
    if (img.complete) {
        handleLoad();
    } else {
        img.onload = handleLoad;
    }
  }, [currentIndex]);

  const playNext = () => {
    setCurrentIndex((prev) => (prev + 1) % songs.length);
  };

  const playPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 w-full p-4 text-white cursor-pointer group pointer-events-auto"
      style={{ background: bgGradient }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(event, info) => {
        if (info.offset.x < -100) {
          playNext(); // swipe left -> next
        } else if (info.offset.x > 100) {
          playPrev(); // swipe right -> prev
        }
      }}
    >
      <div className="flex items-center gap-4">
        <img
          ref={imgRef}
          src={songs[currentIndex].album_art_url}
          alt="album art"
          crossOrigin="anonymous"
          className="w-12 h-12 rounded-xl"
        />
        <div>
          <p className="font-bold">{songs[currentIndex].title}</p>
          <p className="text-sm opacity-70">{songs[currentIndex].artist}</p>
        </div>
      </div>
      <audio ref={audioRef} src={songs[currentIndex].src} autoPlay />
    </motion.div>
  );
}
