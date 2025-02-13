"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
/* Added imports for Firebase favorites logic */
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function BookDetailPage() {
  const { id } = useParams(); // 'id' is the book ID from the URL

  /* Added states for user and favorite status */
  const [user, setUser] = useState<any>(null);
  const [favoriteAdded, setFavoriteAdded] = useState(false);

  const [book, setBook] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* Listen for auth changes so we know which user is logged in */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  /* Existing code: fetch book details from Open Library */
  useEffect(() => {
    async function fetchBookDetails() {
      try {
        const res = await fetch(`https://openlibrary.org/works/${id}.json`);
        if (!res.ok) {
          const errorText = await res.text();
          setError(errorText);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setBook(data);
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    }
    if (id) fetchBookDetails();
  }, [id]);

  if (loading) return <p className="p-8">Loading book details...</p>;
  if (error) return <p className="p-8 text-red-500">Error: {error}</p>;
  if (!book) return <p className="p-8">No details found for this book.</p>;

  // Check if there's a cover image using the 'covers' array
  let coverUrl = null;
  if (book.covers && book.covers.length > 0) {
    coverUrl = `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`;
  }

  /* Added function to add this book to Firestore favorites */
  async function addToFavorites() {
    if (!user) {
      alert("You must be logged in to add favorites.");
      return;
    }

    try {
      // We'll store coverId if available
      let coverId = null;
      if (book.covers && book.covers.length > 0) {
        coverId = book.covers[0];
      }

      // You can parse authors if needed; here we just set "Unknown" or a list
      let author = "Unknown";
      if (book.authors && book.authors.length > 0) {
        author = book.authors.map((a: any) => a.name).join(", ");
      }
      // @ts-ignore - ignoring Firestore type mismatch

      await setDoc(doc(db, "users", user.uid, "favorites", id), {
        id,
        title: book.title,
        coverId,
        author,
        description: book.description
          ? typeof book.description === "string"
            ? book.description
            : book.description.value
          : "No description available",
      });

      setFavoriteAdded(true);
    } catch (err) {
      console.error("Error adding favorite:", err);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
      
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={`${book.title} cover`}
          className="w-64 mb-4 mx-auto"
        />
      ) : (
        <div className="w-64 h-96 bg-gray-200 flex items-center justify-center mb-4 mx-auto">
          <span>No Cover Available</span>
        </div>
      )}

      {/* Display description if available */}
      {book.description ? (
        <p className="mb-4">
          {typeof book.description === "string"
            ? book.description
            : book.description.value}
        </p>
      ) : (
        <p className="mb-4">No description available.</p>
      )}

      {/* Optionally display subjects */}
      {book.subjects && (
        <div className="mb-4">
          <p className="font-bold mb-2">Subjects:</p>
          <ul className="list-disc list-inside inline-block text-left">
            {book.subjects.map((subject: string, index: number) => (
              <li key={index}>{subject}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ADDED: Only show "Add to Favorites" if user is logged in and not yet added */}
      {user && !favoriteAdded && (
        <button
          onClick={addToFavorites}
          className="btn btn-outline border-accent text-accent hover:bg hover:text-white"
        >
          Add to Favorites
        </button>
      )}

      {/* Show confirmation if already favorited */}
      {favoriteAdded && (
        <p className="text-accent mb-4">Book added to favorites!</p>
      )}

      <a href="/search" className="underline text-accent mt-4 block">
        Back to Search
      </a>
    </div>
  );
}