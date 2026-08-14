"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import MyAuctions from "@/components/dashboard/MyAuctions";
import WonAuctions from "@/components/dashboard/WonAuctions";
import { getDashboard } from "@/lib/api/dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState({ myAuctions: [], wonAuctions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await getDashboard();
        setData({
          myAuctions: result.myAuctions || [],
          wonAuctions: result.wonAuctions || [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
        if (err instanceof Error && err.message === "Not authenticated") {
          router.replace("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-24">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Account
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>

        {loading ? (
          <p className="py-16 text-center text-sm text-zinc-400">
            Loading dashboard...
          </p>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <MyAuctions auctions={data.myAuctions} />
            <WonAuctions auctions={data.wonAuctions} />
          </div>
        )}
      </div>
    </main>
  );
}
