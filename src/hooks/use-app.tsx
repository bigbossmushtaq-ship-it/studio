
"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AppContextType {
  // Music Player State
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  profilePic: string;
  setProfilePic: (url: string) => void;
  audioRef: React.RefObject<HTMLAudioElement> | null;
  setAudioRef: (ref: React.RefObject<HTMLAudioElement>) => void;
  // User State
  session: Session | null;
  user: User | null;
  username: string;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Music Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [profilePic, setProfilePicState] = useState("https://placehold.co/200x200.png");
  const [audioRef, setAudioRefState] = useState<React.RefObject<HTMLAudioElement> | null>(null);

  // User State
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setUsername(session.user.email?.split('@')[0] || 'User');
      } else {
        setUsername('Guest');
      }
    });

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
           setUsername(session.user.email?.split('@')[0] || 'User');
        } else {
           setUsername('Guest');
        }
    })

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const setProfilePic = (url: string) => {
    setProfilePicState(url);
    // You might want to save this to user metadata in Supabase
  };
  
  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }

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
    session,
    user,
    username,
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
