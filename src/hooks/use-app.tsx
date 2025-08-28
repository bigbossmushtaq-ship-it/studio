
"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
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
  setAudioRef: (el: HTMLAudioElement | null) => void;
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;
  progress: number;
  duration: number;
  seek: (time: number) => void;
  // User State
  session: Session | null;
  user: User | null;
  username: string;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<{success: boolean}>;
  signup: (email: string, pass: string) => Promise<{success: boolean}>;
  logout: () => Promise<void>;
  // Playlist controls
  playNext: () => void;
  playPrevious: () => void;
  playlist: Song[];
  setPlaylist: (songs: Song[]) => void;
  togglePlayPause: () => void;
  // Audio Visualizer
  analyser: AnalyserNode | null;
  direction: number;
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
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // This is being disabled temporarily to fix core playback.
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const setAudioRef = (el: HTMLAudioElement | null) => {
    setAudio(el);
  };
  
  const playNext = useCallback(() => {
    if (playlist.length > 0) {
      setDirection(1);
      const nextIndex = (currentIndex + 1) % playlist.length;
      setCurrentIndex(nextIndex);
      setCurrentSongState(playlist[nextIndex]);
    }
  }, [playlist, currentIndex]);

  const playPrevious = () => {
    if (playlist.length > 0) {
      setDirection(-1);
      const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      setCurrentIndex(prevIndex);
      setCurrentSongState(playlist[prevIndex]);
    }
  };

  useEffect(() => {
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audio, playNext]);


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
    if (audio) {
      audio.pause();
    }
    setCurrentSongState(null);
    setIsPlaying(false);
  }

  const seek = (time: number) => {
    if (audio && isFinite(audio.duration)) {
      audio.currentTime = time;
       setProgress((time / audio.duration) * 100);
    }
  };

  const togglePlayPause = async () => {
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Playback error:", err)
        setIsPlaying(false);
      }
    }
  };
  
  const setCurrentSong = (song: Song | null) => {
    if (!song) {
      if (audio) {
        audio.pause();
      }
      setCurrentSongState(null);
      setIsPlaying(false);
      return;
    }

    const isSameSong = currentSong?.id === song.id;

    if (isSameSong) {
      togglePlayPause();
    } else {
      const songIndex = playlist.findIndex(s => s.id === song.id);
      if (songIndex !== -1) {
        setCurrentIndex(songIndex);
      } else {
        // If the song is not in the current playlist, add it and play
        const newPlaylist = [song, ...playlist];
        setPlaylist(newPlaylist);
        setCurrentIndex(0);
      }
      setCurrentSongState(song);
      // This will trigger the useEffect below to play the song
    }
  };
  
   useEffect(() => {
    if (!audio || !currentSong) return;
    
    const songUrl = currentSong.song_url || '';
    if (audio.src !== songUrl) {
        audio.src = songUrl;
        audio.load();
    }
    
    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (e) {
        console.error("Error playing new song", e);
        setIsPlaying(false);
      }
    }
    playAudio();

  }, [currentSong, audio]);

  // User State
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('Guest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contextValue: AppContextType = {
    isPlaying,
    setIsPlaying,
    profilePic,
    setProfilePic,
    audio,
    setAudioRef,
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
    playNext,
    playPrevious,
    playlist,
    setPlaylist,
    togglePlayPause,
    analyser,
    direction,
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
