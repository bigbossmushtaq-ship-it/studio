
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
  setIsPlaying: (playing: boolean) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrev: () => void;
  progress: number;
  
  // Global Audio Element
  audioRef: HTMLAudioElement | null;
  setAudioRef: (ref: HTMLAudioElement) => void;
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
  const [progress, setProgress] = useState(0);

  // Global Audio Element
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

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
  }
  
  const setCurrentSong = (song: Song) => {
    setCurrentSongState(song);
    setIsPlaying(true);
  }

  const setIsPlaying = (playing: boolean) => {
    if (!audioRef) return;
    setIsPlayingState(playing);
    if(playing) {
      audioRef.play().catch(e => console.error("Playback error:", e));
    } else {
      audioRef.pause();
    }
  }
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  }

  const playNext = useCallback(() => {
    if (playlist.length === 0 || !currentSong) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentSong(playlist[nextIndex]);
  }, [playlist, currentSong]);

  const playPrev = () => {
    if (playlist.length === 0 || !currentSong) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentSong(playlist[prevIndex]);
  }
  
  // Audio setup
  useEffect(() => {
    if (audioRef) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audioRef);
        const analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 256;
        source.connect(analyserNode);
        analyserNode.connect(audioContext.destination);
        setAnalyser(analyserNode);
      } catch (error) {
        console.error("AudioContext setup failed:", error)
      }
    }
  }, [audioRef]);


  // Audio event listeners
  useEffect(() => {
    if (!audioRef) return;

    const handleTimeUpdate = () => setProgress(audioRef.currentTime);
    const handleEnded = () => playNext();
    
    audioRef.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.addEventListener('ended', handleEnded);

    return () => {
      audioRef.removeEventListener('timeupdate', handleTimeUpdate);
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
      if (isPlaying) {
         audioRef.play().catch(e => {
          console.error("Autoplay failed:", e);
          setIsPlayingState(false);
        });
      } else {
        audioRef.pause();
      }
    }
  }, [currentSong, audioRef, isPlaying]);


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
    setIsPlaying,
    togglePlayPause,
    playNext,
    playPrev,
    progress,
    audioRef,
    setAudioRef,
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
