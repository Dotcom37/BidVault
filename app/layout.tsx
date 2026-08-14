import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BidVault — Real-Time Auctions",
  description: "Buy and sell through live online auctions.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-100 text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  );
}
