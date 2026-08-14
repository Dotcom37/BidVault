"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OtpForm from "@/components/auth/OtpForm";

function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900">
      <nav className="sticky top-0 z-50 flex h-14 items-center border-b bg-white px-6">
        <span className="text-sm font-semibold tracking-tight">
          BidVault
        </span>
      </nav>

      <div className="flex justify-center px-6 py-12">
        <OtpForm email={email} />
      </div>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-zinc-100">
          Loading...
        </main>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}