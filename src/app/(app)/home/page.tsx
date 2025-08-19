"use client";
import * as React from "react";
import { playlists, songs, Song } from "@/lib/data";
import { SongCard } from "@/components/song-card";
import { PlaylistCard } from "@/components/playlist-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="music">Music</TabsTrigger>
          <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6 space-y-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight mb-4">Your Playlists</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {playlists.slice(0, 4).map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight mb-4">New Release from Maroon 5</h3>
            <div className="bg-card p-4 rounded-lg flex items-center gap-4">
              <Image src="https://placehold.co/128x128.png" alt="Love is Like" width={128} height={128} className="rounded-md w-32 h-32" data-ai-hint="album cover" />
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
              {songs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </div>
        </TabsContent>
         <TabsContent value="music">
          <p className="text-center py-12">Music content will be displayed here.</p>
        </TabsContent>
        <TabsContent value="podcasts">
          <p className="text-center py-12">Podcast content will be displayed here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
