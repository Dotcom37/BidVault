"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { createAuction } from "@/lib/api/auctions";

export default function CreateAuctionPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!title.trim() || !startPrice || !endTime) {
      setError("Please fill in all required fields.");
      return;
    }

    if (Number(startPrice) <= 0) {
      setError("Starting price must be greater than 0.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createAuction({
        title: title.trim(),
        description: description.trim(),
        category,
        start_price: Number(startPrice),
        end_time: new Date(endTime).toISOString(),
      });

      router.push("/auctions");
    } catch (error) {
      console.error("CREATE AUCTION ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create auction."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 pb-16 pt-24">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Sell an item
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              Create New Auction
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Add the details of your item and start
              receiving bids.
            </p>
          </div>

          <div className="space-y-6">
            {/* TITLE */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Item Title *
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Vintage Rolex Watch"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe your item..."
                rows={5}
                className="w-full resize-none rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              >
                <option value="">
                  Select category
                </option>
                <option value="watch">Watch</option>
                <option value="electronics">
                  Electronics
                </option>
                <option value="fashion">Fashion</option>
              </select>
            </div>

            {/* PRICE + END TIME */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Starting Price (₹) *
                </label>

                <input
                  type="number"
                  min="1"
                  value={startPrice}
                  onChange={(e) =>
                    setStartPrice(e.target.value)
                  }
                  placeholder="1000"
                  className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Ending Date & Time *
                </label>

                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) =>
                    setEndTime(e.target.value)
                  }
                  className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="button"
              disabled={loading}
              onClick={handleCreate}
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading
                ? "Creating Auction..."
                : "Create Auction"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}