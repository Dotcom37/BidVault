"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isValid = /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async () => {
    if (!isValid || loading) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await forgotPassword(email.trim());

      setMessage(data.message || "If the email exists, a reset link was sent.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900">
      <nav className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-white px-6">
        <span className="text-sm font-semibold tracking-tight">BidVault</span>

        <button
          onClick={() => router.push("/auth/login")}
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          Log in
        </button>
      </nav>

      <div className="flex justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
          <button
            onClick={() => router.push("/auth/login")}
            className="mb-5 text-sm text-zinc-500"
          >
            ← Back
          </button>

          <p className="mb-1 text-[11px] uppercase tracking-wider text-zinc-400">
            Account recovery
          </p>

          <h1 className="text-xl font-semibold">Forgot your password?</h1>

          <p className="mb-6 mt-1 text-sm text-zinc-500">
            Enter your email and we&apos;ll send you a password reset link.
          </p>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {message}
            </div>
          )}

          <label className="text-xs font-medium text-zinc-500">
            Email address
          </label>

          <input
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-md border bg-zinc-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
          />

          <button
            disabled={!isValid || loading}
            onClick={handleSubmit}
            className="mt-6 w-full rounded-md bg-zinc-900 py-2.5 text-sm font-semibold text-white disabled:opacity-30"
          >
            {loading ? "Sending..." : "Send Reset Link →"}
          </button>
        </div>
      </div>
    </main>
  );
}
