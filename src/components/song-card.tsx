
import Image from "next/image";
import { Play } from "lucide-react";
import { Song } from "@/lib/data";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import AlbumArt from "./album-art";
import { useApp } from "@/hooks/use-app";

export function SongCard({ song }: { song: Song }) {
  const { setCurrentSong, currentSong, isPlaying } = useApp();

  const handlePlay = () => {
    setCurrentSong(song);
  };
  
  const isThisSongPlaying = currentSong?.id === song.id && isPlaying;

  return (
    <Card className="group flex flex-col gap-2 p-4 bg-card hover:bg-muted/80 transition-colors">
      <div className="relative">
        <AlbumArt
          src={song.album_art_url || song.albumArt || ''}
          alt={`Album art for ${song.title}`}
          className="w-full rounded-md aspect-square object-cover"
        />
      </div>
      <div className="truncate pt-2 flex justify-between items-center">
        <div className="truncate">
            <p className="font-semibold truncate">{song.title}</p>
            <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
        </div>
         <Button
          size="icon"
          onClick={handlePlay}
          className="h-10 w-10 rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 scale-90 group-hover:scale-100 flex-shrink-0"
        >
          <Play className="h-6 w-6 fill-current" />
        </Button>
      </div>
    </Card>
  );
}
