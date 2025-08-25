
"use client";

import { Toaster } from "@/components/ui/toaster";
import { AppProvider, useApp } from "@/hooks/use-app";
import { ThemeProvider } from "@/hooks/use-theme";
import React, { useEffect, useRef } from "react";


function GlobalAudio() {
  const { setAudioRef } = useApp();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      setAudioRef(audioRef.current);
    }
  }, [setAudioRef]);

  return <audio ref={audioRef} preload="auto" className="hidden" />;
}

export function ClientRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AppProvider>
        <GlobalAudio />
        {children}
        <Toaster />
      </AppProvider>
    </ThemeProvider>
  )
}
