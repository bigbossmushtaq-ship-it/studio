
"use client"

import { useApp } from "@/hooks/use-app";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useRef } from "react";

export function MusicAvatar({ size = 32, ringWidth = 2 }: { size?: number, ringWidth?: number }) {
  const { isPlaying, audio, profilePic } = useApp();
  const { spectrumVisualEffects } = useTheme();
  const rafRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setupAudioContext = () => {
      if (isPlaying && audio && !audioContextRef.current) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = ctx;

        try {
          const source = ctx.createMediaElementSource(audio);
          sourceRef.current = source;
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 512;
          analyserRef.current = analyser;

          source.connect(analyser);
          analyser.connect(ctx.destination);
        } catch (e) {
            console.error("Error setting up audio context:", e)
            return; 
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
       if (sourceRef.current) {
          sourceRef.current.disconnect();
          sourceRef.current = null;
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

    if (isPlaying && spectrumVisualEffects) {
      setupAudioContext();
    } else {
      cleanup();
    }
    
    // Cleanup on component unmount or when audio changes
    return cleanup;
  }, [isPlaying, audio, spectrumVisualEffects]);
  
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
            mask: `radial-gradient(transparent ${size/2}px, black ${size/2}px)`,
            display: spectrumVisualEffects ? 'block' : 'none',
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
