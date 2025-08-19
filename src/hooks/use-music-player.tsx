
"use client"
import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';

interface MusicPlayerContextType {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  profilePic: string;
  setProfilePic: (url: string) => void;
  audioRef: React.RefObject<HTMLAudioElement> | null;
  setAudioRef: (ref: React.RefObject<HTMLAudioElement>) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [profilePic, setProfilePic] = useState("https://placehold.co/200x200.png");
  const [audioRef, setAudioRefState] = useState<React.RefObject<HTMLAudioElement> | null>(null);

  const setAudioRef = (ref: React.RefObject<HTMLAudioElement>) => {
    setAudioRefState(ref);
  }

  return (
    <MusicPlayerContext.Provider value={{ isPlaying, setIsPlaying, profilePic, setProfilePic, audioRef, setAudioRef }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = (): MusicPlayerContextType => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
