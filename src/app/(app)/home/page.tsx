"use client";
import * as React from "react";
import { recommendSongs, RecommendSongsInput } from "@/ai/flows/theme-based-recommendations";
import { playlists, songs, Song } from "@/lib/data";
import { SongCard } from "@/components/song-card";
import { PlaylistCard } from "@/components/playlist-card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Play } from "lucide-react";

export default function HomePage() {
  const [recommended, setRecommended] = React.useState<Song[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const input: RecommendSongsInput = {
          listeningHistory: ["Midnight City", "Clair de Lune"],
          songMetadata: songs.map(({ title, artist, genre, theme }) => ({ title, artist, genre, theme })),
        };
        const result = await recommendSongs(input);
        
        const recommendedSongsData = result.recommendedSongs
          .map(title => songs.find(s => s.title === title))
          .filter((s): s is Song => s !== undefined);

        setRecommended(recommendedSongsData);

      } catch (error) {
        console.error("Failed to get recommendations:", error);
        toast({
          title: "Error",
          description: "Could not fetch song recommendations.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [toast]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
          <Button variant="primary" className="rounded-full bg-primary text-primary-foreground">All</Button>
          <Button variant="ghost" className="rounded-full bg-muted text-muted-foreground">Music</Button>
          <Button variant="ghost" className="rounded-full bg-muted text-muted-foreground">Podcasts</Button>
      </div>
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.slice(0, 8).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </div>
       <div>
        <h3 className="text-2xl font-bold tracking-tight mb-4">New release from Maroon 5</h3>
        <div className="bg-card p-4 rounded-lg flex items-center gap-4">
           <Image src="https://placehold.co/200x200.png" alt="Love is Like" width={128} height={128} className="rounded-md w-32 h-32" data-ai-hint="album cover" />
           <div className="flex-1">
            <p className="text-sm text-muted-foreground">Album</p>
            <h4 className="text-2xl font-bold">Love Is Like</h4>
            <p className="text-muted-foreground">Maroon 5</p>
           </div>
           <Button size="icon" className="h-12 w-12 rounded-full bg-primary text-primary-foreground"><Play className="h-6 w-6 fill-current" /></Button>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-4">Jump back in</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading && Array.from({ length: 6 }).map((_, i) => (
             <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
          {!loading && recommended.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </div>
    </div>
  );
}
