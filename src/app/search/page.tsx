"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  return (
    <Suspense fallback={<p>Loading search...</p>}>
      <SearchComponent />
    </Suspense>
  );
}

function SearchComponent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Automatically trigger search if there's an initial query from the URL
  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, [initialQuery]);

  async function handleSearch() {
    if (!query.trim()) return; // Prevent empty searches
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        const errorText = await res.text();
        setError(errorText);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Book Search</h1>
      {/* Input + Search Button */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter book title or author"
          className="input input-bordered border-accent flex-grow"
        />
        <button
          onClick={handleSearch}
          className="btn btn-outline border-accent text-accent hover:bg hover:text-white"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && results.length === 0 && <p>No results yet.</p>}
      {!loading && results.length > 0 && (
        <div>
          {results.map((item, idx) => {
            // For Open Library, extract the book ID from item.link
            let openLibId = "";
            if (item.source === "Open Library" && item.link) {
              const parts = item.link.split("/");
              openLibId = parts[parts.length - 1];
            }

            return (
              <div key={idx} className="border-b pb-2 mb-2">
                {item.source === "Open Library" && openLibId ? (
                  <Link
                    href={`/book/${openLibId}`}
                    className="font-bold text-lg underline text-[#333]"
                  >
                    Title: {item.title}
                  </Link>
                ) : (
                  <p className="font-bold text-lg">Title: {item.title}</p>
                )}
                <p>Author: {item.author}</p>
                <p className="text-sm text-gray-500">Source: {item.source}</p>
                {/* Cover Image */}
                {item.cover && (
                  <img
                    src={item.cover}
                    alt="Book Cover"
                    className="w-32 mt-2"
                  />
                )}
                {/* Project Gutenberg Download Links */}
                {item.source === "Project Gutenberg" && item.downloads && (
                  <div className="mt-2">
                    <p className="font-bold">Download Links:</p>
                    {item.downloads.epub && (
                      <a
                        href={item.downloads.epub}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[#333] mr-2"
                      >
                        EPUB
                      </a>
                    )}
                    {item.downloads.pdf && (
                      <a
                        href={item.downloads.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[#333] mr-2"
                      >
                        PDF
                      </a>
                    )}
                    {item.downloads.text && (
                      <a
                        href={item.downloads.text}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[#333]"
                      >
                        TEXT
                      </a>
                    )}
                  </div>
                )}
                {/* Fallback link if no downloads */}
                {!item.downloads && item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-[#333] block mt-2"
                  >
                    View More
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}