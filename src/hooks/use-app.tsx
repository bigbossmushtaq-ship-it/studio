
"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Music Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [profilePic, setProfilePicState] = useState("https://placehold.co/200x200.png");
  const [audioRef, setAudioRefState] = useState<React.RefObject<HTMLAudioElement> | null>(null);

  // User State
  const [username, setUsernameState] = useState("your_username");
  const [email, setEmailState] = useState("novamusic0987@gmail.com");
  
  useEffect(() => {
    const savedUsername = localStorage.getItem('tuneflow_username');
    const savedEmail = localStorage.getItem('tuneflow_email');
    const savedProfilePic = localStorage.getItem('tuneflow_profile_pic');

    if (savedUsername) setUsernameState(savedUsername);
    if (savedEmail) setEmailState(savedEmail);
    if (savedProfilePic) setProfilePicState(savedProfilePic);
  }, []);

  const setUsername = (newUsername: string) => {
    setUsernameState(newUsername);
    localStorage.setItem('tuneflow_username', newUsername);
  };

  const setEmail = (newEmail: string) => {
    setEmailState(newEmail);
    localStorage.setItem('tuneflow_email', newEmail);
  };
  
  const setProfilePic = (url: string) => {
    setProfilePicState(url);
    localStorage.setItem('tuneflow_profile_pic', url);
  };
  
  const logout = () => {
    setUsernameState('your_username');
    setEmailState('novamusic0987@gmail.com');
    setProfilePicState('https://placehold.co/200x200.png');
    localStorage.removeItem('tuneflow_username');
    localStorage.removeItem('tuneflow_email');
    localStorage.removeItem('tuneflow_profile_pic');
    // No need to redirect here, the button will handle it
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
    username,
    setUsername,
    email,
    setEmail,
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
