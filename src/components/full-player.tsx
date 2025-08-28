
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Music2, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import type { Song } from '@/lib/data';
import { Slider } from './ui/slider';
import AlbumArt from './album-art';
import type { SwipeableHandlers } from 'react-swipeable';

interface FullPlayerProps {
    song: Song;
    isPlaying: boolean;
    progress: number;
    duration: number;
    bgColor: string;
    albumArtUrl?: string;
    swipeHandlers: SwipeableHandlers;
    formatTime: (time: number) => string;
    handleSeek: (value: number[]) => void;
    onClose: () => void;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function FullPlayer({
    song,
    isPlaying,
    progress,
    duration,
    bgColor,
    albumArtUrl,
    swipeHandlers,
    formatTime,
    handleSeek,
    onClose,
    onPlayPause,
    onNext,
    onPrev
}: FullPlayerProps) {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: bgColor }}
    >
      <div className="relative flex-grow flex flex-col items-center justify-center p-4 text-white">
        <button
          onClick={onClose}
          className="absolute top-6 left-4 p-2 rounded-full hover:bg-white/10"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
        <div {...swipeHandlers} className="flex flex-col items-center gap-8">
            <motion.div 
                key={song.id} 
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5}}
                className='w-full max-w-xs'
            >
                <AlbumArt
                    src={albumArtUrl || ''}
                    alt={song.title}
                    width={400}
                    height={400}
                    className="w-full aspect-square rounded-lg shadow-2xl"
                />
            </motion.div>
            <div className="text-center">
                <h2 className="text-2xl font-bold">{song.title}</h2>
                <p className="text-lg opacity-80">{song.artist}</p>
            </div>
        </div>

        <div className="w-full max-w-md mt-auto space-y-4">
            <div className="space-y-2">
                <Slider
                value={[progress]}
                max={100}
                onValueChange={handleSeek}
                className="w-full"
                />
                <div className="flex justify-between text-xs">
                <span>{formatTime(duration * (progress / 100))}</span>
                <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div className="flex justify-center items-center gap-4">
                <button onClick={onPrev} className="p-2 rounded-full hover:bg-white/10">
                    <SkipBack className="w-8 h-8 fill-current" />
                </button>
                <button
                    onClick={onPlayPause}
                    className="bg-white text-black rounded-full p-4"
                >
                    {isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                    ) : (
                    <Play className="w-8 h-8 fill-current" />
                    )}
                </button>
                <button onClick={onNext} className="p-2 rounded-full hover:bg-white/10">
                    <SkipForward className="w-8 h-8 fill-current" />
                </button>
            </div>
        </div>
      </div>
    </motion.div>
  );
}
