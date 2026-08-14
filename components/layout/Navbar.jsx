"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const close = () => setIsOpen(false);

  return (
    <>
      <nav className="fixed top-0 z-50 flex h-14 w-full items-center justify-between border-b bg-white px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-md p-1 text-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            ☰
          </button>
          <Link href="/" className="font-semibold tracking-tight text-gray-900">
            ⚒ BidVault
          </Link>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          {isAuthenticated ? (
            <>
              <span className="hidden text-gray-600 sm:block">
                Hi, {user?.name?.split(" ")[0] || "there"}
              </span>
              <button
                onClick={() => {
                  logout();
                  close();
                }}
                className="text-gray-600 hover:text-black"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-600 hover:text-black">
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-black px-4 py-1.5 text-white hover:bg-gray-800"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {isOpen && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-[60] cursor-default bg-black/20 backdrop-blur-sm"
          onClick={close}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-[70] h-full w-64 bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b px-6">
          <span className="font-bold">BidVault</span>
          <button onClick={close} className="text-xl text-gray-500 hover:text-black" aria-label="Close menu">
            ×
          </button>
        </div>

        <nav className="space-y-1 p-4">
          <Link href="/auctions" onClick={close} className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
            Browse Auctions
          </Link>

          {isAuthenticated && (
            <>
              <Link href="/auctions/create" onClick={close} className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
                Create Auction
              </Link>
              <Link href="/dashboard" onClick={close} className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
                Dashboard
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
