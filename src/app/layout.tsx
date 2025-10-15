import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CTF Challenge Platform",
  description: "Share and solve CTF challenges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <div className="flex flex-col min-h-screen">
          <header className="border-b border-border bg-card">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold text-foreground">CTF Challenge Platform</h1>
            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t border-border bg-card py-6 mt-8">
            <div className="container mx-auto px-4 text-center text-muted-foreground">
              <p>© {new Date().getFullYear()} CTF Challenge Platform. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
