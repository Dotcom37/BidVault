"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api/auth";

export default function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pwStrength = (() => {
    if (
      password.length >= 12 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return 3;
    }

    if (password.length >= 8) return 2;
    if (password.length >= 4) return 1;

    return 0;
  })();

  const isValid =
    name.trim() &&
    /\S+@\S+\.\S+/.test(email) &&
    password.length >= 6;

  const handleSignup = async () => {
    if (!isValid || loading) return;

    setLoading(true);
    setError("");

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      router.push(
        `/auth/verify-otp?email=${encodeURIComponent(
          email.trim()
        )}`
      );
    } catch (error) {
      setError(
        error.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
      <p className="mb-1 text-[11px] uppercase tracking-wider text-zinc-400">
        Create account
      </p>

      <h1 className="text-xl font-semibold">
        Join BidVault
      </h1>

      <p className="mb-6 mt-1 text-sm text-zinc-500">
        Start bidding on live auctions in seconds.
      </p>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="text-xs font-medium text-zinc-500">
          Full name
        </label>

        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleSignup()
          }
          className="mt-1 w-full rounded-md border bg-zinc-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
          placeholder="Your name"
        />
      </div>

      <div className="mb-4">
        <label className="text-xs font-medium text-zinc-500">
          Email address
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleSignup()
          }
          className="mt-1 w-full rounded-md border bg-zinc-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
          placeholder="you@example.com"
        />
      </div>

      <div className="mb-4">
        <label className="text-xs font-medium text-zinc-500">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSignup()
            }
            className="mt-1 w-full rounded-md border bg-zinc-100 px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
            placeholder="Min. 6 characters"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((value) => !value)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            👁
          </button>
        </div>

        <div className="mt-2 flex gap-1">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={`h-[2px] flex-1 ${
                pwStrength >= level
                  ? pwStrength === 1
                    ? "bg-red-500"
                    : pwStrength === 2
                    ? "bg-yellow-500"
                    : "bg-green-600"
                  : "bg-zinc-300"
              }`}
            />
          ))}
        </div>
      </div>

      <button
        disabled={!isValid || loading}
        onClick={handleSignup}
        className="mt-2 w-full rounded-md bg-zinc-900 py-2.5 text-sm font-semibold text-white transition disabled:opacity-30"
      >
        {loading ? "Processing..." : "Continue →"}
      </button>

      <p className="mt-5 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <button
          onClick={() => router.push("/auth/login")}
          className="font-medium text-zinc-900 hover:underline"
        >
          Log in
        </button>
      </p>
    </div>
  );
}