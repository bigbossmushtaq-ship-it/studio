
"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  // Music Player State
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  profilePic: string;
  setProfilePic: (url: string) => void;
  audioRef: React.RefObject<HTMLAudioElement> | null;
  setAudioRef: (ref: React.RefObject<HTMLAudioElement>) => void;
  // User State
  username: string;
  setUsername: (username: string) => void;
  email: string;
  setEmail: (email: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Music Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [profilePic, setProfilePic] = useState("https://placehold.co/200x200.png");
  const [audioRef, setAudioRefState] = useState<React.RefObject<HTMLAudioElement> | null>(null);

  // User State
  const [username, setUsername] = useState("your_username");
  const [email, setEmail] = useState("novamusic0987@gmail.com");


  const setAudioRef = (ref: React.RefObject<HTMLAudioElement>) => {
    setAudioRefState(ref);
  }

  const contextValue = {
    isPlaying,
    setIsPlaying,
    profilePic,
    setProfilePic,
    audioRef,
    setAudioRef,
    username,
    setUsername,
    email,
    setEmail
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
