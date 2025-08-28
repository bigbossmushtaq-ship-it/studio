
"use client";

import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/hooks/use-app";
import { ThemeProvider } from "@/hooks/use-theme";
import React from "react";

export function ClientRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AppProvider>
        {children}
        <Toaster />
      </AppProvider>
    </ThemeProvider>
  )
}
