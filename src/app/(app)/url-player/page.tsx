
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, PlayCircle } from "lucide-react";

export default function UrlAudioPlayerPage() {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [urlInput, setUrlInput] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const handlePlay = () => {
    if (!audioRef.current) return;
    setError(null);

    if (urlInput) {
      // Set the new source
      audioRef.current.src = urlInput;
      // Play the audio
      audioRef.current.play().catch(e => {
        console.error("Playback failed:", e);
        setError("Failed to play the audio. Please check the URL and try again.");
      });
    } else {
      setError("Please enter an audio URL.");
    }
  };
  
  const handleError = () => {
      setError("Invalid audio source or format. Please try a different URL.");
  }

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
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button onClick={handlePlay}>
                <PlayCircle className="mr-2 h-4 w-4" /> Play
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

          <div className="pt-4">
            <audio
              ref={audioRef}
              controls
              className="w-full"
              onError={handleError}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
