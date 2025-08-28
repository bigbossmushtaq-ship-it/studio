
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
  setCurrentSong: (song: Song) => void;
  isPlaying: boolean;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrev: () => void;
  
  // Global Audio Element
  analyser: AnalyserNode | null;
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
  const [currentSong, setCurrentSongState] = useState<Song | null>(null);
  const [isPlaying, setIsPlayingState] = useState(false);

  // Global Audio Element
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);


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
  
  useEffect(() => {
    // Initialize audio element
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    setAudioRef(audio);

    // Cleanup
    return () => {
        audio.pause();
    }
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
  }
  
  const setupAudioContext = useCallback(() => {
      if (audioContext || !audioRef) return;
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = context.createMediaElementSource(audioRef);
        const analyserNode = context.createAnalyser();
        analyserNode.fftSize = 256;
        source.connect(analyserNode);
        analyserNode.connect(context.destination);
        
        setAudioContext(context);
        setAnalyser(analyserNode);
      } catch (e) {
        console.error("Failed to create audio context:", e);
      }
  }, [audioContext, audioRef]);

  const setCurrentSong = (song: Song) => {
    setupAudioContext();
    setCurrentSongState(song);
    setIsPlayingState(true);
  }
  
  const togglePlayPause = () => {
    if (!currentSong) return;
    setIsPlayingState(!isPlaying);
  }

  const playNext = useCallback(() => {
    if (playlist.length === 0 || !currentSong) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentSongState(playlist[nextIndex]);
    setIsPlayingState(true);
  }, [playlist, currentSong]);

  const playPrev = () => {
    if (playlist.length === 0 || !currentSong) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentSongState(playlist[prevIndex]);
    setIsPlayingState(true);
  }

  // Audio event listeners
  useEffect(() => {
    if (!audioRef) return;
    const handleEnded = () => playNext();
    audioRef.addEventListener('ended', handleEnded);
    return () => {
      audioRef.removeEventListener('ended', handleEnded);
    }
  }, [audioRef, playNext]);


  // Update audio source when current song changes
  useEffect(() => {
    if (audioRef && currentSong) {
      if (audioRef.src !== currentSong.song_url) {
        audioRef.src = currentSong.song_url!;
        audioRef.load();
      }
    }
  }, [currentSong, audioRef]);

  // Handle play/pause state
  useEffect(() => {
    if(audioRef) {
      if(isPlaying) {
         audioRef.play().catch(e => {
          console.error("Autoplay failed:", e);
          setIsPlayingState(false);
        });
      } else {
        audioRef.pause();
      }
    }
  }, [isPlaying, audioRef]);


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
    isPlaying,
    togglePlayPause,
    playNext,
    playPrev,
    analyser
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
