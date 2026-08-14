"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="border-b bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
          BidVault
        </p>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl">
          Real-Time Online Auctions
        </h1>

        <p className="max-w-2xl text-base leading-7 text-zinc-500 sm:text-lg">
          Buy rare items or sell your own through live,
          competitive bidding. Fast, transparent, and
          exciting auctions powered in real time.
        </p>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auctions/create"
            className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Wanna sell something?
          </Link>

          <Link
            href="/auctions"
            className="rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
          >
            Browse auctions
          </Link>
        </div>
      </div>
    </section>
  );
}