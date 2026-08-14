"use client";

import Link from "next/link";

export default function AuctionCard({ auction }) {
  const {
    id,
    title,
    category,
    start_price,
    current_price,
    end_time,
  } = auction;

  const isEnded = auction.is_active === false;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-3">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
          {category}
        </p>

        <h2 className="mt-1 text-lg font-semibold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-400">
          Current bid
        </p>

        <p className="text-xl font-bold text-black">
          ₹{Number(current_price).toLocaleString()}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Starting: ₹
          {Number(start_price).toLocaleString()}
        </p>
      </div>

      <div className="mb-4 text-xs text-gray-500">
        {isEnded ? (
          <span className="font-medium text-red-500">
            Auction ended
          </span>
        ) : (
          <>
            Ends:{" "}
            {new Date(end_time).toLocaleString()}
          </>
        )}
      </div>

      <Link
        href={`/auctions/${id}`}
        className="block rounded-lg bg-black px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-gray-800"
      >
        {isEnded ? "View Auction" : "Join Auction"}
      </Link>
    </div>
  );
}