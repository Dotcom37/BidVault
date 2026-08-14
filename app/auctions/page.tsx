"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import SearchBar from "@/components/auctions/SearchBar";
import AuctionGrid from "@/components/auctions/AuctionGrid";
import { searchAuctions } from "@/lib/api/auctions";
import type { Auction } from "@/types/auction";

export default function AuctionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";

  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await searchAuctions(query);

        setAuctions(data);
      } catch (error) {
        console.error("AUCTION SEARCH ERROR:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load auctions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [query]);

  const handleSearch = (value: string) => {
    if (value) {
      router.push(
        `/auctions?q=${encodeURIComponent(value)}`
      );
    } else {
      router.push("/auctions");
    }
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Browse Auctions
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Find something worth bidding on.
          </p>
        </div>

        <SearchBar
          key={query}
          initialValue={query}
          onSearch={handleSearch}
        />

        {loading ? (
          <div className="py-16 text-center text-sm text-zinc-400">
            Loading auctions...
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-500">
            {error}
          </div>
        ) : (
          <AuctionGrid auctions={auctions} />
        )}
      </div>
    </main>
  );
}