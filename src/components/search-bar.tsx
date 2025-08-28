
'use client';

import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        placeholder="What do you want to listen to?"
        className="pl-10 text-base"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
