"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AuctionDetails from "@/components/auctions/AuctionDetails";
import BidForm from "@/components/auctions/BidForm";
import BidHistory from "@/components/auctions/BidHistory";
import { getAuction } from "@/lib/api/auctions";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";
import type { Auction } from "@/types/auction";

export default function AuctionPage() {
  const params = useParams<{ id: string }>();
  const auctionId = String(params.id);

  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const {
    currentBid,
    history,
    timeLeft,
    ended,
    error: bidError,
    placeBid,
  } = useAuctionSocket(auctionId);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setLoading(true);
        setPageError("");
        setAuction(await getAuction(auctionId));
      } catch (error) {
        console.error("AUCTION FETCH ERROR:", error);
        setPageError(
          error instanceof Error ? error.message : "Failed to load auction."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [auctionId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-100">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center pt-14">
          <p className="text-sm text-zinc-400">Loading auction...</p>
        </div>
      </main>
    );
  }

  if (pageError || !auction) {
    return (
      <main className="min-h-screen bg-zinc-100">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-6 pt-14">
          <div className="text-center">
            <h1 className="text-xl font-semibold">Auction unavailable</h1>
            <p className="mt-2 text-sm text-red-500">
              {pageError || "Auction not found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const displayedBid = currentBid || Number(auction.current_price);

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-24">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Live Auction
          </p>
          <h1 className="mt-1 text-2xl font-bold">{auction.title}</h1>
        </div>

        {bidError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {bidError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AuctionDetails
              auction={{ ...auction, current_price: displayedBid }}
              timeLeft={timeLeft}
            />
          </div>

          <div className="space-y-6">
            <BidForm
              currentBid={displayedBid}
              disabled={ended || timeLeft <= 0}
              onPlaceBid={placeBid}
            />
            <BidHistory history={history} />
          </div>
        </div>
      </div>
    </main>
  );
}
