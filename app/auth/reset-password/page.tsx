"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/api/auth";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isValid =
    newPassword.length >= 6 && newPassword === confirmPassword && token;

  const handleSubmit = async () => {
    if (!isValid || loading) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await resetPassword({
        token,
        newPassword,
      });

      setMessage(data.message || "Password reset successful.");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900">
      <nav className="sticky top-0 z-50 flex h-14 items-center border-b bg-white px-6">
        <span className="text-sm font-semibold tracking-tight">BidVault</span>
      </nav>

      <div className="flex justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
          <p className="mb-1 text-[11px] uppercase tracking-wider text-zinc-400">
            Account recovery
          </p>

          <h1 className="text-xl font-semibold">Reset your password</h1>

          <p className="mb-6 mt-1 text-sm text-zinc-500">
            Choose a new password for your account.
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

          {!token && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              Invalid or missing reset token.
            </div>
          )}

          <div className="mb-4">
            <label className="text-xs font-medium text-zinc-500">
              New password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-md border bg-zinc-100 px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
                placeholder="Min. 6 characters"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                👁
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-zinc-500">
              Confirm password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-md border bg-zinc-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
              placeholder="Enter password again"
            />
          </div>

          {confirmPassword && newPassword !== confirmPassword && (
            <p className="mb-4 text-xs text-red-500">Passwords do not match.</p>
          )}

          <button
            disabled={!isValid || loading}
            onClick={handleSubmit}
            className="w-full rounded-md bg-zinc-900 py-2.5 text-sm font-semibold text-white disabled:opacity-30"
          >
            {loading ? "Resetting..." : "Reset Password →"}
          </button>

          <button
            onClick={() => router.push("/auth/login")}
            className="mt-4 w-full text-sm text-zinc-500 hover:text-zinc-900"
          >
            Back to login
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-zinc-100">
          Loading...
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
