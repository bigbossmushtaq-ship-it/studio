
"use client"

import { useApp } from "@/hooks/use-app";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useRef } from "react";

export function MusicAvatar({ size = 32, ringWidth = 2 }: { size?: number, ringWidth?: number }) {
  const { isPlaying, profilePic, analyser } = useApp();
  const { spectrumVisualEffects } = useTheme();
  const rafRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loop = () => {
      if (!containerRef.current || !analyser || !isPlaying) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
        if(containerRef.current) {
           containerRef.current.style.setProperty("--pulse", "0");
        }
        return;
      };

      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length / 255;
      const eased = Math.min(1, avg * 2);
      
      containerRef.current.style.setProperty("--pulse", String(eased));
      containerRef.current.style.setProperty("--spin", String(performance.now() / 1000));
      
      rafRef.current = requestAnimationFrame(loop);
    };

    if (isPlaying && spectrumVisualEffects && analyser) {
      if (!rafRef.current) {
          loop();
      }
    } else {
       if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
       if(containerRef.current) {
        containerRef.current.style.setProperty("--pulse", "0");
      }
    }
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [isPlaying, spectrumVisualEffects, analyser]);
  
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
            transform: "scale(calc(1 + var(--pulse) * 0.2))"
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
