
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
  audioRef: React.RefObject<HTMLAudioElement> | null;
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSong, setCurrentSongState] = useState<Song | null>(null);


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
    
    // Setup audio listeners
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.crossOrigin = "anonymous";
    }


    return () => {
      authListener.subscription.unsubscribe();
       if (audio) {
        audio.removeEventListener('ended', () => setIsPlaying(false));
      }
    };
  }, []);
  
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
  }


  const setCurrentSong = (song: Song | null) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!song) {
        audio.pause();
        audio.src = '';
        setIsPlaying(false);
        setCurrentSongState(null);
        return;
    }

    const isSameSong = currentSong?.id === song.id;
    const songUrl = song.song_url || song.fileUrl || '';

    if (isSameSong) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.error("Resume error:", err));
      }
    } else {
      setCurrentSongState(song);
      setIsPlaying(false);
      audio.src = songUrl;
      audio.currentTime = 0;
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Play error:", err));
    }
  };


  const contextValue = {
    isPlaying,
    setIsPlaying,
    profilePic,
    setProfilePic,
    audioRef: audioRef,
    currentSong,
    setCurrentSong,
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
