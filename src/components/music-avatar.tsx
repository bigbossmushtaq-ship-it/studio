
"use client"

import { useMusicPlayer } from "@/hooks/use-music-player";
import { useEffect, useRef, useState } from "react";

export function MusicAvatar({ size = 32, ringWidth = 2 }: { size?: number, ringWidth?: number }) {
  const { isPlaying, audioRef, profilePic } = useMusicPlayer();
  const rafRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setupAudioContext = () => {
      if (isPlaying && audioRef?.current && !audioContextRef.current) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = ctx;

        const source = ctx.createMediaElementSource(audioRef.current);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        analyserRef.current = analyser;

        source.connect(analyser);
        source.connect(ctx.destination);

        const data = new Uint8Array(analyser.frequencyBinCount);

        const loop = () => {
          if (!containerRef.current || !analyserRef.current) {
            rafRef.current = requestAnimationFrame(loop);
            return;
          };

          analyserRef.current.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / (data.length * 255);
          const eased = Math.min(1, avg * 2);
          
          containerRef.current.style.setProperty("--pulse", String(eased));
          containerRef.current.style.setProperty("--spin", String(performance.now() / 1000));
          
          rafRef.current = requestAnimationFrame(loop);
        };
        loop();
      }
    }
    setupAudioContext();
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    }
  }, [isPlaying, audioRef, profilePic]);

  useEffect(() => {
    if (!isPlaying && audioContextRef.current) {
      audioContextRef.current.close().then(() => {
        audioContextRef.current = null;
        analyserRef.current = null;
      });
      cancelAnimationFrame(rafRef.current);
      if(containerRef.current) {
        containerRef.current.style.setProperty("--pulse", "0");
      }
    }
  }, [isPlaying]);
  
  const total = size + ringWidth * 2;
  const maskRadius = size / 2;

  return (
      <div
        ref={containerRef}
        id="avatar-visualizer-container"
        style={{
          width: total,
          height: total,
          borderRadius: "50%",
          position: "relative",
          "--pulse": 0,
          "--spin": 0,
          boxShadow:
            "0 0 calc(6px + 10px * var(--pulse)) rgba(255,255,255,0.4)",
        } as React.CSSProperties}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            padding: ringWidth,
            background:
              "conic-gradient(red, magenta, blue, cyan, lime, yellow, red)",
            filter: "hue-rotate(calc(var(--spin) * 60deg))",
            WebkitMask:
              `radial-gradient(circle at center, transparent ${maskRadius-ringWidth}px, black ${maskRadius}px)`,
            mask: `radial-gradient(circle at center, transparent ${maskRadius-ringWidth}px, black ${maskRadius}px)`
          }}
        />
        <img
          src={profilePic}
          alt="profile"
          style={{
            position: "absolute",
            top: ringWidth,
            left: ringWidth,
            width: size,
            height: size,
            borderRadius: "50%",
            objectFit: "cover",
          }}
          data-ai-hint="profile picture"
        />
      </div>
  );
}
