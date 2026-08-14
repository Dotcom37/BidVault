"use client";

import { useEffect, useState } from "react";
import { getAuction } from "@/lib/api/auctions";

export function useAuction(auctionId) {
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auctionId) return;

    const fetchAuction = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAuction(auctionId);

        setAuction(data);
      } catch (error) {
        console.error("AUCTION ERROR:", error);
        setError(error.message || "Failed to load auction");
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [auctionId]);

  return {
    auction,
    loading,
    error,
  };
}