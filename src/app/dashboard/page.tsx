"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Monitor authentication state and redirect if not logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch the user's favorites from Firestore
  useEffect(() => {
    async function fetchFavorites() {
      if (user) {
        const favRef = collection(db, "users", user.uid, "favorites");
        const snapshot = await getDocs(favRef);
        const favs = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setFavorites(favs);
      }
      setLoading(false);
    }
    fetchFavorites();
  }, [user]);

  // Function to remove a favorite from Firestore
  async function removeFavorite(favId: string) {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "favorites", favId));
      // Remove favorite from state
      setFavorites((prev) => prev.filter((fav) => fav.id !== favId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  }

  if (loading) return <p className="p-8">Loading your favorites...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
      {favorites.length === 0 ? (
        <p>You have no favorites. Try adding some books!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((book, idx) => {
            // Construct cover URL if coverId is present
            let coverUrl = null;
            if (book.coverId) {
              coverUrl = `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`;
            }

            return (
              <div key={idx} className="relative border p-4 mb-2">
                <Link href={`/book/${book.id}`} className="block">
                  <div className="text-center">
                    <h2 className="font-bold text-lg mb-2">{book.title}</h2>
                    <p>Author: {book.author || "Unknown"}</p>
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt="Book Cover"
                        className="w-32 mx-auto mt-2"
                      />
                    ) : (
                      <p className="mt-2">No cover available</p>
                    )}
                  </div>
                </Link>
                {/* Remove favorite button in the top right */}
                <button
                  onClick={() => removeFavorite(book.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
      <a href="/search" className="underline text-[#333] mt-4 block">
        Back to Search
      </a>
    </div>
  );
}