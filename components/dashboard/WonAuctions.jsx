"use client";

import Link from "next/link";

export default function WonAuctions({ auctions = [] }) {
  return (
    <section className="rounded-2xl bg-black p-6 text-white shadow-xl">
      <h2 className="mb-6 text-lg font-bold">Bids Won</h2>

      {auctions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 opacity-40">
          <div className="mb-2 text-4xl">🏆</div>
          <p className="text-xs font-bold uppercase tracking-widest">
            No victories yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {auctions.map((auction) => (
            <Link
              key={auction.id}
              href={`/auctions/${auction.id}`}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-transform hover:scale-[1.02]"
            >
              <div>
                <h3 className="text-sm font-medium">{auction.title}</h3>
                <p className="mt-1 font-mono text-xs text-zinc-500">
                  ₹{Number(auction.current_price).toLocaleString()}
                </p>
              </div>
              <span className="text-zinc-500">↗</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
