
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, UserPlus, Mic, Disc } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Your Library</h2>
      </div>
      <Tabs defaultValue="playlists" className="w-full">
        <TabsList>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="artists">Artists</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
          <TabsTrigger value="songs">Liked Songs</TabsTrigger>
        </TabsList>
        <TabsContent value="playlists" className="mt-6">
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center">
            <h3 className="text-xl font-semibold">Create your first playlist</h3>
            <p className="text-muted-foreground mt-2 mb-4">It's easy, we'll help you.</p>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create playlist
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="artists" className="mt-6">
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center">
            <h3 className="text-xl font-semibold">You haven't followed any artists yet</h3>
            <p className="text-muted-foreground mt-2 mb-4">Find artists you love and follow them.</p>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Find artists
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="albums" className="mt-6">
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center">
            <h3 className="text-xl font-semibold">You haven't saved any albums yet</h3>
            <p className="text-muted-foreground mt-2 mb-4">Browse and save your favorite albums.</p>
            <Button>
              <Disc className="mr-2 h-4 w-4" />
              Browse albums
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="podcasts" className="mt-6">
           <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center">
            <h3 className="text-xl font-semibold">You haven't saved any podcasts yet</h3>
            <p className="text-muted-foreground mt-2 mb-4">Browse and save your favorite podcasts.</p>
            <Button>
              <Mic className="mr-2 h-4 w-4" />
              Find podcasts
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="songs" className="mt-6">
           <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center">
            <h3 className="text-xl font-semibold">Songs you like will appear here</h3>
            <p className="text-muted-foreground mt-2">Save songs by tapping the heart icon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
