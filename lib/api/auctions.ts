const API_URL = "/api/auctions";

// Get live auctions
import type { Auction } from "@/types/auction";

export async function getLiveAuctions(): Promise<Auction[]> {
  const res = await fetch("/api/home/live", { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch auctions");
  }

  return res.json();
}

// Get auctions grouped by category
export async function getGroupedAuctions() {
  const res = await fetch("/api/home/grouped");

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to fetch grouped auctions"
    );
  }

  return data;
}

// Search auctions
export async function searchAuctions(query = "") {
  const res = await fetch(
    `${API_URL}/search?q=${encodeURIComponent(query)}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Auction search failed");
  }

  return data;
}

// Get a single auction
export async function getAuction(auctionId: number | string): Promise<Auction> {
  const res = await fetch(
    `${API_URL}/${auctionId}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to fetch auction"
    );
  }

  return data;
}

// Create an auction
export async function createAuction({
  title,
  description,
  category,
  start_price,
  end_time,
}: {
  title: string;
  description: string;
  category: string;
  start_price: number;
  end_time: string;
}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      category,
      start_price,
      end_time,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to create auction"
    );
  }

  return data;
}