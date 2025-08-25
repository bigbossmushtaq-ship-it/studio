"use client";

import { Toaster } from "@/components/ui/toaster";
import { AppProvider, useApp } from "@/hooks/use-app";
import { ThemeProvider } from "@/hooks/use-theme";
import React from "react";

// We need a client component to access the audioRef from the context
function GlobalAudioPlayer() {
  const { audioRef } = useApp();
  // The audio tag is rendered here but controlled globally.
  // It's hidden from the user's view but accessible to the app.
  return <audio ref={audioRef} style={{ display: 'none' }} />;
}


export function ClientRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AppProvider>
        {children}
        <GlobalAudioPlayer />
        <Toaster />
      </AppProvider>
    </ThemeProvider>
  )
}
