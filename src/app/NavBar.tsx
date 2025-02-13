"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

export default function NavBar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="bg-[#5e382e] text-[#e5ab85] p-4 flex justify-between items-center">
      <div className="logo text-2xl font-bold">Llibrary</div>
      <nav className="flex space-x-4">
        <Link href="/">Home</Link>
        <Link href="/search">Search</Link>
        {user && <Link href="/dashboard">Favorites</Link>}
        {!user ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </nav>
    </header>
  );
}