"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  verifyOtp,
  resendOtp,
} from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";

export default function OtpForm({ email }) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [digits, setDigits] = useState(
    Array(6).fill("")
  );

  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  const isComplete = digits.every(
    (digit) => digit !== ""
  );

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(
      () => setTimeLeft((prev) => prev - 1),
      1000
    );

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const canResend = timeLeft <= 0;

  const handleChange = (value, index) => {
    const digit = value.slice(-1);

    if (!/^\d?$/.test(digit)) return;

    const next = [...digits];
    next[index] = digit;

    setDigits(next);

    if (
      digit &&
      index < 5
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key !== "Backspace") return;

    if (!digits[index] && index > 0) {
      const next = [...digits];

      next[index - 1] = "";

      setDigits(next);

      inputRefs.current[index - 1]?.focus();
    } else {
      const next = [...digits];

      next[index] = "";

      setDigits(next);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const next = Array(6).fill("");

    pasted.split("").forEach(
      (digit, index) => {
        next[index] = digit;
      }
    );

    setDigits(next);

    inputRefs.current[
      Math.min(pasted.length, 5)
    ]?.focus();
  };

  const handleVerify = async () => {
    if (!isComplete || loading) return;

    setLoading(true);
    setError("");

    try {
      const data = await verifyOtp({
        email,
        otp: digits.join(""),
      });

      localStorage.setItem(
        "token",
        data.token
      );

      setUser(data.user);

      router.push("/");
    } catch (error) {
      setError(
        error.message || "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;

    setResending(true);
    setError("");

    try {
      await resendOtp(email);

      setDigits(Array(6).fill(""));
      setTimeLeft(30);

      inputRefs.current[0]?.focus();
    } catch (error) {
      setError(
        error.message || "Failed to resend OTP"
      );
    } finally {
      setResending(false);
    }
  };

  const minutes = Math.floor(
    timeLeft / 60
  );

  const seconds = String(
    timeLeft % 60
  ).padStart(2, "0");

  return (
    <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
      <button
        onClick={() =>
          router.push("/auth/signup")
        }
        className="mb-5 text-sm text-zinc-500"
      >
        ← Back
      </button>

      <h1 className="mb-2 text-xl font-semibold">
        Verify your email
      </h1>

      <p className="mb-4 text-sm text-zinc-500">
        Enter the 6-digit code sent to
      </p>

      <div className="mb-6 inline-block rounded-full border bg-zinc-100 px-3 py-1 text-xs">
        {email}
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div
        className="mb-3 flex gap-2"
        onPaste={handlePaste}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] =
                element;
            }}
            value={digit}
            type="text"
            inputMode="numeric"
            maxLength={1}
            onChange={(event) =>
              handleChange(
                event.target.value,
                index
              )
            }
            onKeyDown={(event) =>
              handleKeyDown(
                event,
                index
              )
            }
            className="w-full rounded-md border bg-zinc-100 py-3 text-center text-lg outline-none focus:ring-2 focus:ring-zinc-900"
          />
        ))}
      </div>

      <div className="mb-4 flex justify-between text-xs text-zinc-500">
        {!canResend ? (
          <span>
            Resend in {minutes}:{seconds}
          </span>
        ) : (
          <span />
        )}

        <button
          disabled={!canResend || resending}
          onClick={handleResend}
          className="text-zinc-900 disabled:text-zinc-400"
        >
          {resending
            ? "Sending..."
            : "Resend"}
        </button>
      </div>

      <button
        disabled={!isComplete || loading}
        onClick={handleVerify}
        className="w-full rounded-md bg-zinc-900 py-2.5 text-white disabled:opacity-30"
      >
        {loading
          ? "Verifying..."
          : "Verify & Continue →"}
      </button>
    </div>
  );
}