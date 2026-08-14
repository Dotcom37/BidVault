"use client";

import { useState } from "react";

export default function BidForm({
  currentBid,
  onPlaceBid,
  disabled = false,
}) {
  const [bid, setBid] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (disabled) return;

    const amount = Number(bid);

    if (!amount || amount <= Number(currentBid)) {
      setError(
        `Your bid must be higher than ₹${Number(
          currentBid
        ).toLocaleString()}`
      );
      return;
    }

    setError("");

    onPlaceBid(amount);

    setBid("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-5"
    >
      <h2 className="mb-4 text-lg font-semibold">
        Place a Bid
      </h2>

      <div className="mb-3">
        <p className="text-xs text-gray-400">
          Current highest bid
        </p>

        <p className="text-2xl font-bold">
          ₹{Number(currentBid).toLocaleString()}
        </p>
      </div>

      <input
        type="number"
        min={Number(currentBid) + 1}
        value={bid}
        onChange={(e) => setBid(e.target.value)}
        placeholder={`More than ₹${Number(
          currentBid
        ).toLocaleString()}`}
        disabled={disabled}
        className="mb-3 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
      />

      {error && (
        <p className="mb-3 text-sm text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={disabled || !bid}
        className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {disabled ? "Auction Ended" : "Place Bid"}
      </button>
    </form>
  );
}