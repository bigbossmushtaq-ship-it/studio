
"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import { Song } from '@/lib/data';

interface AppContextType {
  // User State
  session: Session | null;
  user: User | null;
  username: string;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<{success: boolean}>;
  signup: (email: string, pass: string) => Promise<{success: boolean}>;
  logout: () => Promise<void>;
  profilePic: string;
  setProfilePic: (url: string) => void;
  
  // Music Player State
  playlist: Song[];
  setPlaylist: (songs: Song[]) => void;
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;
  playNext: () => void;
  playPrev: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // User State
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('Guest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profilePic, setProfilePicState] = useState("https://placehold.co/200x200.png");

  // Music Player State
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

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
        setUsername(session.user.email?.split('@[')[0] || 'User');
      } else {
        setUsername('Guest');
      }
      setLoading(false);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
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
  };
  
  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentSong(null);
  }

  const playNext = useCallback(() => {
    if (playlist.length === 0 || !currentSong) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    if (currentIndex === -1) {
      if (playlist.length > 0) setCurrentSong(playlist[0]);
      return;
    }
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentSong(playlist[nextIndex]);
  }, [playlist, currentSong]);

  const playPrev = () => {
    if (playlist.length === 0 || !currentSong) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    if (currentIndex === -1) {
      if (playlist.length > 0) setCurrentSong(playlist[0]);
      return;
    }
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentSong(playlist[prevIndex]);
  }

  const contextValue: AppContextType = {
    profilePic,
    setProfilePic,
    session,
    user,
    username,
    loading,
    error,
    login,
    signup,
    logout,
    playlist,
    setPlaylist,
    currentSong,
    setCurrentSong,
    playNext,
    playPrev,
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
