
"use client";

import { Clock } from "lucide-react";
import { Song } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AlbumArt from "./album-art";
import { useApp } from "@/hooks/use-app";
import { Button } from "./ui/button";
import { Pause, Play } from "lucide-react";

function SongItemRow({ song, index, onPlay, onPause, isPlaying, currentSong }: { song: Song; index: number; onPlay: (song: Song) => void; onPause: () => void; isPlaying: boolean; currentSong: Song | null; }) {
  const isCurrent = song.id === currentSong?.id;

  return (
    <TableRow className="group">
      <TableCell className="w-12 text-center">
         <div className="relative h-10 w-10">
          <span className="absolute inset-0 flex items-center justify-center text-base group-hover:hidden">
            {index + 1}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="absolute inset-0 h-10 w-10 hidden group-hover:flex items-center justify-center"
            onClick={() => isCurrent && isPlaying ? onPause() : onPlay(song)}
          >
            {isCurrent && isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-4">
          <AlbumArt
            src={song.album_art_url}
            width={40}
            height={40}
            alt={song.title}
            className="rounded"
          />
          <div className="truncate">
            <p className="font-medium truncate">{song.title}</p>
            <p className="text-muted-foreground truncate">{song.artist}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell truncate">{song.album}</TableCell>
      <TableCell className="text-right">{song.duration || 'N/A'}</TableCell>
    </TableRow>
  );
}

export function SongList({ songs }: { songs: Song[] }) {
  const { setCurrentSong, setIsPlaying, currentSong, isPlaying } = useApp();

  const handlePlay = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };
  
  const handlePause = () => {
    setIsPlaying(false);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12 text-center">#</TableHead>
          <TableHead>Track</TableHead>
          <TableHead className="hidden md:table-cell">Album</TableHead>
          <TableHead className="text-right">
            <Clock className="h-4 w-4 inline-block" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {songs.map((song, index) => (
          <SongItemRow 
            key={song.id} 
            song={song} 
            index={index} 
            onPlay={handlePlay} 
            onPause={handlePause}
            isPlaying={isPlaying}
            currentSong={currentSong}
          />
        ))}
      </TableBody>
    </Table>
  );
}
