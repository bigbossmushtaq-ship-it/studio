"use client";
import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Play, Pause, SkipForward, SkipBack, X } from "lucide-react";
import { useApp } from "@/hooks/use-app";
import type { Song } from "@/lib/data";

interface Track {
  title: string;
  artist: string;
  album_art_url: string;
}

const MiniPlayer: React.FC<{
  currentTrack: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onExpand: () => void;
}> = ({ currentTrack, isPlaying, onPlayPause, onNext, onPrev, onExpand }) => {
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setSwipeDir("left");
      onNext();
      setTimeout(() => setSwipeDir(null), 300);
    },
    onSwipedRight: () => {
      setSwipeDir("right");
      onPrev();
      setTimeout(() => setSwipeDir(null), 300);
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div
      {...handlers}
      onClick={(e) => {
        // Stop propagation if the click target is the button
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }
        onExpand();
      }}
      className={`fixed bottom-20 md:bottom-4 left-2 right-2 md:left-auto md:w-96 rounded-lg h-[64px] flex items-center justify-between px-3 bg-black/80 backdrop-blur-sm text-white cursor-pointer z-40
      ${swipeDir === "left" ? "animate-swipe-left" : ""} 
      ${swipeDir === "right" ? "animate-swipe-right" : ""}`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <img
          src={currentTrack.album_art_url || '/default-album.png'}
          alt="album"
          className="w-12 h-12 rounded-md object-cover"
        />
        <div className="truncate">
          <h4 className="text-sm font-medium truncate">{currentTrack.title}</h4>
          <p className="text-xs text-gray-300 truncate">{currentTrack.artist}</p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPlayPause();
        }}
        className="p-2 rounded-full hover:bg-white/10"
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
    </div>
  );
};

const FullPlayer: React.FC<{
  currentTrack: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}> = ({ currentTrack, isPlaying, onPlayPause, onNext, onPrev, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-lg text-white p-4 flex flex-col z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Now Playing</h2>
        <button onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <img
        src={currentTrack.album_art_url || '/default-album.png'}
        alt="album"
        className="w-full h-auto aspect-square max-w-sm mx-auto object-cover rounded-xl mb-4 shadow-2xl"
      />
      <div className="text-center">
        <h3 className="text-xl font-bold">{currentTrack.title}</h3>
        <p className="text-gray-300">{currentTrack.artist}</p>
      </div>


      <div className="flex justify-center items-center gap-6 my-6">
        <button onClick={onPrev}>
          <SkipBack size={32} />
        </button>
        <button
          onClick={onPlayPause}
          className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center"
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <button onClick={onNext}>
          <SkipForward size={32} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-6">
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Lyrics</h4>
            <p className="text-sm text-gray-300">
              [Lyrics will be shown here when connected to API]
            </p>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Artist Profile</h4>
            <p className="text-sm text-gray-300">
              Name: {currentTrack.artist}
              <br />
              Followers: [placeholder]
              <br />
              Description: Artist bio goes here.
            </p>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Credits</h4>
            <p className="text-sm text-gray-300">[Song credits placeholder]</p>
          </div>
      </div>

    </div>
  );
};

export default function PlayerContainer() {
  const { currentSong, isPlaying, togglePlayPause, playNext, playPrev } = useApp();
  const [expanded, setExpanded] = useState(false);

  if (!currentSong) {
    return null;
  }

  const track: Track = {
    title: currentSong.title,
    artist: currentSong.artist,
    album_art_url: currentSong.album_art_url || '',
  };

  return (
    <div className="pointer-events-auto">
      <MiniPlayer
        currentTrack={track}
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onNext={playNext}
        onPrev={playPrev}
        onExpand={() => setExpanded(true)}
      />
      {expanded && (
        <FullPlayer
          currentTrack={track}
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onNext={playNext}
          onPrev={playPrev}
          onClose={() => setExpanded(false)}
        />
      )}
    </div>
  );
}
