"use client";

import AuctionTimer from "./AuctionTimer";

export default function AuctionDetails({ auction, timeLeft }) {
  if (!auction) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
          {auction.category}
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          {auction.title}
        </h1>
      </div>

      {auction.description && (
        <p className="mb-6 text-sm leading-6 text-gray-500">
          {auction.description}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-400">
            Starting price
          </p>

          <p className="mt-1 text-lg font-semibold">
            ₹{Number(auction.start_price).toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-400">
            Current price
          </p>

          <p className="mt-1 text-lg font-semibold">
            ₹{Number(auction.current_price).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
        <span className="text-sm text-gray-500">
          Time remaining
        </span>

        <AuctionTimer initialTimeLeft={timeLeft} />
      </div>
    </div>
  );
}