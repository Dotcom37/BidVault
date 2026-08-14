"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid =
    /\S+@\S+\.\S+/.test(email) &&
    password.length >= 6;

  const handleLogin = async () => {
    if (!isValid || loading) return;

    setLoading(true);
    setError("");

    try {
      const data = await loginUser({
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", data.token);

      setUser(data.user);

      router.push("/");
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
      <p className="mb-1 text-[11px] uppercase tracking-wider text-zinc-400">
        Welcome back
      </p>

      <h1 className="text-xl font-semibold">
        Log in to BidVault
      </h1>

      <p className="mb-6 mt-1 text-sm text-zinc-500">
        Jump back into the action.
      </p>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="text-xs font-medium text-zinc-500">
          Email address
        </label>

        <input
          autoFocus
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleLogin()
          }
          className="mt-1 w-full rounded-md border bg-zinc-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
          placeholder="you@example.com"
        />
      </div>

      <div className="mb-2">
        <label className="text-xs font-medium text-zinc-500">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleLogin()
            }
            className="mt-1 w-full rounded-md border bg-zinc-100 px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
            placeholder="Your password"
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
      </div>

      <div className="mb-2 text-right">
        <button
          onClick={() =>
            router.push("/auth/forgot-password")
          }
          className="text-xs text-zinc-500 hover:text-zinc-900"
        >
          Forgot password?
        </button>
      </div>

      <button
        disabled={!isValid || loading}
        onClick={handleLogin}
        className="mt-4 w-full rounded-md bg-zinc-900 py-2.5 text-sm font-semibold text-white transition disabled:opacity-30"
      >
        {loading ? "Logging in..." : "Log in →"}
      </button>

      <p className="mt-5 text-center text-sm text-zinc-500">
        New to BidVault?{" "}
        <button
          onClick={() => router.push("/auth/signup")}
          className="font-medium text-zinc-900 hover:underline"
        >
          Create account
        </button>
      </p>
    </div>
  );
}