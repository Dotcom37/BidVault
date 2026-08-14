"use client";

import { useEffect, useState } from "react";

export default function AuctionTimer({ initialTimeLeft = 0 }) {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, Number(initialTimeLeft)));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (timeLeft <= 0) {
    return <span className="font-semibold text-red-500">Auction ended</span>;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <span className="font-mono font-semibold">
      {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}
