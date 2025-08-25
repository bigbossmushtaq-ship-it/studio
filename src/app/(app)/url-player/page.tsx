
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Pause, Play } from "lucide-react";
import { Slider } from '@/components/ui/slider';

export default function UrlAudioPlayerPage() {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [urlInput, setUrlInput] = React.useState('');
  const [audioSrc, setAudioSrc] = React.useState('');
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!urlInput) {
      setError("Please enter an audio URL.");
      return;
    }
    setError(null);
    const audio = audioRef.current;
    if (!audio) return;

    // New song
    if (audioSrc !== urlInput) {
      setAudioSrc(urlInput);
      audio.src = urlInput;
      audio.load();
      audio.play().then(() => setIsPlaying(true)).catch(handlePlaybackError);
    } else {
      // Same song, toggle play/pause
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => setIsPlaying(true)).catch(handlePlaybackError);
      }
    }
  };
  
  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || isNaN(audio.duration)) return;
    const newTime = (value[0] / 100) * audio.duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePlaybackError = (e: any) => {
      console.error("Playback Error:", e);
      setError("Invalid audio URL or format is not supported.");
      setIsPlaying(false);
  }
  
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
        if(isFinite(audio.duration)) {
          setDuration(audio.duration);
        }
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handlePlaybackError);

    return () => {
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handlePlaybackError);
    }
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Play Audio from URL</CardTitle>
          <CardDescription>
            Enter the URL of an audio file to play it directly in the browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="audio-url">Audio URL</Label>
            <div className="flex gap-2">
              <Input
                id="audio-url"
                type="url"
                placeholder="https://example.com/audio.mp3"
                value={urlInput}
                onChange={(e) => {
                    setUrlInput(e.target.value);
                    setError(null);
                }}
              />
              <Button onClick={handlePlayPause}>
                {isPlaying && audioSrc === urlInput ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying && audioSrc === urlInput ? 'Pause' : 'Play'}
              </Button>
            </div>
          </div>
          
          {error && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="pt-4 space-y-4">
             <audio ref={audioRef} preload="auto" className="hidden" />
             <Slider 
                value={[progress]} 
                onValueChange={handleSeek} 
                className="w-full"
                disabled={!audioSrc || !isFinite(duration)}
             />
             <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
