
"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import { Song } from '@/lib/data';

interface AppContextType {
  // Music Player State
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  profilePic: string;
  setProfilePic: (url: string) => void;
  audio: HTMLAudioElement | null;
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;
  progress: number;
  duration: number;
  seek: (progress: number) => void;
  // User State
  session: Session | null;
  user: User | null;
  username: string;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<{success: boolean}>;
  signup: (email: string, pass: string) => Promise<{success: boolean}>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Music Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [profilePic, setProfilePicState] = useState("https://placehold.co/200x200.png");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSongState] = useState<Song | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);


  // User State
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("Guest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
            setUsername(session.user.email?.split('@')[0] || 'User');
        }
        setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setUsername(session.user.email?.split('@')[0] || 'User');
      } else {
        setUsername('Guest');
      }
      setLoading(false);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);
  
  const login = async (email: string, pass: string) => {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) {
        setError(error.message);
        setLoading(false);
        return { success: false };
      }
      return { success: true };
  }
  
  const signup = async (email: string, pass: string) => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password: pass
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return { success: false };
      }
      // Manually refresh the session to ensure the user is logged in
      if (data.user) {
         const { data: { session }, error: sessionError } = await supabase.auth.refreshSession();
         if(sessionError) {
            setError(sessionError.message);
         } else {
            setSession(session);
            setUser(session?.user ?? null);
         }
      }
      return { success: true };
  }
  
  const setProfilePic = (url: string) => {
    setProfilePicState(url);
    // You might want to save this to user metadata in Supabase
  };
  
  const logout = async () => {
    await supabase.auth.signOut();
    if (audio) {
      audio.pause();
    }
    setCurrentSongState(null);
    setIsPlaying(false);
    setAudio(null);
  }

  const seek = (newProgress: number) => {
    if (audio && isFinite(audio.duration)) {
      audio.currentTime = (newProgress / 100) * audio.duration;
      setProgress(newProgress);
    }
  };

  const setCurrentSong = (song: Song | null) => {
    if (!song) {
        if(audio) audio.pause();
        setCurrentSongState(null);
        setIsPlaying(false);
        setAudio(null);
        return;
    }

    const isSameSong = currentSong?.id === song.id;

    if (isSameSong && audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.error("Resume error:", err));
      }
    } else {
      if (audio) {
        audio.pause();
      }
      
      const newAudio = new Audio(song.song_url || song.fileUrl || '');
      newAudio.crossOrigin = "anonymous";
      
      const handleTimeUpdate = () => {
         if (newAudio.duration) {
           setProgress((newAudio.currentTime / newAudio.duration) * 100);
           setDuration(newAudio.duration);
         }
      };
      const handleEnded = () => setIsPlaying(false);

      newAudio.addEventListener('timeupdate', handleTimeUpdate);
      newAudio.addEventListener('ended', handleEnded);
      
      setAudio(newAudio);
      setCurrentSongState(song);

      newAudio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Playback failed:", err);
          setIsPlaying(false);
        });
    }
  };


  const contextValue = {
    isPlaying,
    setIsPlaying,
    profilePic,
    setProfilePic,
    audio,
    currentSong,
    setCurrentSong,
    progress,
    duration,
    seek,
    session,
    user,
    username,
    loading,
    error,
    login,
    signup,
    logout,
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
