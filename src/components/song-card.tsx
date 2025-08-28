
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { Song } from "@/lib/data";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import AlbumArt from "./album-art";
import { useApp } from "@/hooks/use-app";
import { cn } from "@/lib/utils";

export function SongCard({ song }: { song: Song }) {
  const { setCurrentSong, currentSong, isPlaying, togglePlayPause } = useApp();

  const isThisSongPlaying = currentSong?.id === song.id && isPlaying;

  const handlePlayPause = () => {
    if (isThisSongPlaying) {
      togglePlayPause();
    } else {
      setCurrentSong(song);
    }
  };

  return (
    <Card
      onClick={handlePlayPause}
      className="group flex cursor-pointer flex-col gap-2 p-4 bg-card hover:bg-muted/80 transition-colors"
    >
      <div className="relative">
        <AlbumArt
          src={song.album_art_url || ''}
          alt={`Album art for ${song.title}`}
          className="w-full rounded-md aspect-square object-cover"
        />
        <Button
          size="icon"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card's onClick from firing
            handlePlayPause();
          }}
          className={cn(
            "absolute bottom-2 right-2 h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg flex-shrink-0 transition-opacity"
          )}
        >
          {isThisSongPlaying ? (
            <Pause className="h-6 w-6 fill-current" />
          ) : (
            <Play className="h-6 w-6 fill-current" />
          )}
        </Button>
      </div>
      <div className="truncate pt-2">
        <p className="font-semibold truncate">{song.title}</p>
        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
      </div>
    </Card>
  );
}
