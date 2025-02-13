import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Extract the search query from the URL, e.g., ?q=harry+potter
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    
    // If no query is provided, return an empty array
    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    // -----------------------------------------
    // 1. Fetch from Open Library API
    // -----------------------------------------
    const openLibraryPromise = fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
    )
      .then((res) => res.json())
      .then((data) => data.docs || []);

    // -----------------------------------------
    // 2. Fetch from Gutendex API (Project Gutenberg)
    // -----------------------------------------
    const gutendexPromise = fetch(
      `https://gutendex.com/books?search=${encodeURIComponent(query)}`
    )
      .then((res) => res.json())
      .then((data) => {
        const results = data.results || [];
        return results.map((book: any) => {
          const formats = book.formats || {};
          return {
            source: "Project Gutenberg",
            title: book.title,
            author:
              book.authors && book.authors.length > 0
                ? book.authors.map((a: any) => a.name).join(", ")
                : "Unknown",
            cover: formats["image/jpeg"] || null,
            downloads: {
              epub: formats["application/epub+zip"] || null,
              pdf: formats["application/pdf"] || null,
              text:
                formats["text/plain; charset=utf-8"] ||
                formats["text/plain"] ||
                null,
            },
          };
        });
      });

    // -----------------------------------------
    // Run both API calls in parallel
    // -----------------------------------------
    const [openLibraryResults, gutendexResults] = await Promise.all([
      openLibraryPromise,
      gutendexPromise,
    ]);

    // Format Open Library results
    const openLibFormatted = openLibraryResults.map((book: any) => ({
      source: "Open Library",
      title: book.title,
      author:
        book.author_name && book.author_name.length > 0
          ? book.author_name.join(", ")
          : "Unknown",
      cover: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null,
      link: book.key ? `https://openlibrary.org${book.key}` : null,
    }));

    // Combine results from both sources
    const combinedResults = [
      ...openLibFormatted,
      ...gutendexResults,
    ];

    return NextResponse.json({ results: combinedResults });
  } catch (err: any) {
    console.error("API Route Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}