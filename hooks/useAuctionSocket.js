"use client";

import { useCallback, useEffect, useState } from "react";

export function useAuctionSocket(auctionId) {
  const [currentBid, setCurrentBid] = useState(0);
  const [history, setHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!auctionId) return;

    const response = await fetch(`/api/auctions/${auctionId}`, {
      cache: "no-store",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to load auction");
    }

    const remaining = Math.max(
      0,
      Math.floor((new Date(data.end_time).getTime() - Date.now()) / 1000)
    );

    setCurrentBid(Number(data.current_price));
    setTimeLeft(remaining);
    setEnded(remaining <= 0 || data.is_active === false);

    const bidsResponse = await fetch(`/api/auctions/${auctionId}/bids`, {
      cache: "no-store",
    });
    if (bidsResponse.ok) {
      const bids = await bidsResponse.json();
      setHistory(Array.isArray(bids) ? bids : []);
    }
  }, [auctionId]);

  useEffect(() => {
    if (!auctionId) return;

    let cancelled = false;

    const load = async () => {
      try {
        setError("");
        await refresh();
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load auction");
        }
      }
    };

    load();
    const interval = window.setInterval(load, 1000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [auctionId, refresh]);

  const placeBid = async (newBid) => {
    try {
      setError("");

      const response = await fetch(`/api/auctions/${auctionId}/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: Number(newBid) }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Bid failed");
        return;
      }

      setCurrentBid(Number(data.newBid));
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bid failed");
    }
  };

  return {
    currentBid,
    history,
    timeLeft,
    ended,
    error,
    placeBid,
  };
}
