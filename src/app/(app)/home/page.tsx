"use client";
import * as React from "react";
import { recommendSongs, RecommendSongsInput } from "@/ai/flows/theme-based-recommendations";
import { playlists, songs, Song } from "@/lib/data";
import { SongCard } from "@/components/song-card";
import { PlaylistCard } from "@/components/playlist-card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">Good Afternoon</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.slice(0, 3).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-4">Made For You</h3>
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
      
      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-4">Recently Played</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {songs.slice(0, 6).map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </div>
    </div>
  );
}
