"use client";

import Link from "next/link";

export default function MyAuctions({ auctions = [] }) {
  if (auctions.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-bold">
          My Active Auctions
        </h2>

        <p className="py-10 text-center text-sm text-zinc-400">
          No active listings.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          My Active Auctions
        </h2>

        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium">
          {auctions.length}
        </span>
      </div>

      <div className="space-y-4">
        {auctions.map((auction) => {
          const auctionOver = auction.is_active === false;

          return (
            <Link
              key={auction.id}
              href={`/auctions/${auction.id}`}
              className={`group flex items-center justify-between rounded-xl border border-zinc-100 p-4 transition ${
                auctionOver
                  ? "bg-zinc-50 opacity-50"
                  : "hover:border-zinc-300 hover:shadow-md"
              }`}
            >
              <div>
                <h3 className="font-semibold text-zinc-800">
                  {auction.title}
                </h3>

                <p className="font-mono text-sm text-zinc-500">
                  ₹
                  {Number(
                    auction.current_price
                  ).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase text-zinc-400">
                  {auctionOver ? "Closed" : "Ends"}
                </p>

                <p className="text-xs font-medium">
                  {new Date(
                    auction.end_time
                  ).toLocaleDateString()}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}