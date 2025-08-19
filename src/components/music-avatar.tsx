
"use client"

import { useMusicPlayer } from "@/hooks/use-music-player";
import { useEffect, useRef } from "react";

export function MusicAvatar({ size = 32, ringWidth = 2 }: { size?: number, ringWidth?: number }) {
  const { isPlaying, audioRef, profilePic } = useMusicPlayer();
  const rafRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setupAudioContext = () => {
      if (isPlaying && audioRef?.current && !audioContextRef.current) {
        // A new AudioContext can only be created after a user gesture.
        // We assume the gesture to start playing music has already happened.
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = ctx;

        try {
          const source = ctx.createMediaElementSource(audioRef.current);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 512;
          analyserRef.current = analyser;

          source.connect(analyser);
          analyser.connect(ctx.destination); // Connect analyser to destination to hear audio
        } catch (e) {
          // If the source is already connected, it will throw an error.
          if (e instanceof DOMException && e.name === 'InvalidStateError') {
             // We can safely ignore this error if an analyser is already set up.
             if (!analyserRef.current) {
                const analyser = ctx.createAnalyser();
                analyser.fftSize = 512;
                analyserRef.current = analyser;
                analyser.connect(ctx.destination);
             }
          } else {
            console.error("Error setting up audio context:", e)
            return; // Exit if there's a different error
          }
        }

        const data = new Uint8Array(analyserRef.current.frequencyBinCount);

        const loop = () => {
          if (!containerRef.current || !analyserRef.current || !isPlaying) {
            if (rafRef.current) {
              cancelAnimationFrame(rafRef.current);
              rafRef.current = 0;
            }
            return;
          };

          analyserRef.current.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length / 255;
          const eased = Math.min(1, avg * 2);
          
          containerRef.current.style.setProperty("--pulse", String(eased));
          containerRef.current.style.setProperty("--spin", String(performance.now() / 1000));
          
          rafRef.current = requestAnimationFrame(loop);
        };

        if (!rafRef.current) {
            loop();
        }
      }
    }

    const cleanup = () => {
       if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(e => console.error("Error closing audio context", e));
        audioContextRef.current = null;
        analyserRef.current = null;
      }
       if(containerRef.current) {
        containerRef.current.style.setProperty("--pulse", "0");
      }
    };

    if (isPlaying) {
      setupAudioContext();
    } else {
      cleanup();
    }
    
    return cleanup;
  }, [isPlaying, audioRef]);
  
  const total = size + ringWidth * 2;

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
            WebkitMask: `radial-gradient(transparent ${size/2}px, black ${size/2}px)`,
            mask: `radial-gradient(transparent ${size/2}px, black ${size/2}px)`
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
