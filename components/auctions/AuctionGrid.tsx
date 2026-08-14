import AuctionCard from "./AuctionCard";
import type { Auction } from "@/types/auction";

type AuctionGridProps = {
  auctions: Auction[];
};

export default function AuctionGrid({
  auctions,
}: AuctionGridProps) {
  if (auctions.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-gray-400">
        No auctions found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {auctions.map((auction) => (
        <AuctionCard
          key={auction.id}
          auction={auction}
        />
      ))}
    </div>
  );
} 