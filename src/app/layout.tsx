import "./globals.css";
import NavBar from "./NavBar"; // or from "./components/NavBar" if you placed NavBar.tsx there

export const metadata = {
  title: "L-library",
  description: "for people who love reading",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#e5ab85] text-[#5e382e]">
        {/* Navbar is now a client component */}
        <NavBar />

        <main>{children}</main>

        <footer className="bg-[#5e382e] text-[#e5ab85] p-4 text-center">
          © 2025 Llibrary. All rights reserved.
        </footer>
      </body>
    </html>
  );
}