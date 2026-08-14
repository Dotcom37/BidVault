"use client";

export default function BidHistory({ history = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Bid History
        </h2>

        <span className="text-xs text-gray-400">
          Latest 10
        </span>
      </div>

      {history.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          No bids yet.
        </p>
      ) : (
        <div className="space-y-2">
          {history.map((bid, index) => (
            <div
              key={`${bid.amount}-${index}`}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
            >
              <span className="text-sm text-gray-500">
                Bid #{history.length - index}
              </span>

              <span className="font-mono font-semibold">
                ₹{Number(bid.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}