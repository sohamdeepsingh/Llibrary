"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch() {
    // Navigate to /search with a query parameter
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-secondary text-primary">
      <h1 className="text-4xl font-bold mb-4">Welcome to L's library</h1>
      <p className="mb-6">Discover your next great read.</p>

      {/* Search bar + button */}
      <div className="flex space-x-2 items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books..."
          className="input input-bordered border-accent"
        />
        <button
          onClick={handleSearch}
          className="btn btn-outline border-accent text-accent hover:bg hover:text-white"
        >
          Search
        </button>
      </div>
      <p className="mt-6 text-center text-[var(--color-primary)] max-w-xl">
        A web app which would be refined non-stop, as of now only 90,000 books
        out of 150,000,000 books can be downloaded.
      </p>
    </div>
  );
}