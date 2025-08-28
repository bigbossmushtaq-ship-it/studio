import { Card } from "@/components/ui/card";
import { SearchBar } from "@/components/search-bar";

const genres = [
  { name: "Rock", color: "bg-red-500" },
  { name: "Pop", color: "bg-blue-500" },
  { name: "Jazz", color: "bg-yellow-500" },
  { name: "Classical", color: "bg-purple-500" },
  { name: "Hip Hop", color: "bg-green-500" },
  { name: "Electronic", color: "bg-pink-500" },
  { name: "Ambient", color: "bg-indigo-500" },
  { name: "Lo-Fi", color: "bg-teal-500" },
  { name: "Synthwave", color: "bg-cyan-500" },
  { name: "Folk", color: "bg-orange-500" },
  { name: "Metal", color: "bg-gray-700" },
  { name: "Blues", color: "bg-sky-600" },
];

export default function SearchPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">Search</h2>
        <SearchBar />
      </div>
      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-4">Browse all</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {genres.map((genre) => (
            <Card key={genre.name} className={`relative h-40 overflow-hidden rounded-lg ${genre.color}`}>
              <div className="p-4">
                <h4 className="text-xl font-bold text-white">{genre.name}</h4>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
