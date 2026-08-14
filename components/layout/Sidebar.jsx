"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar({ isOpen, onClose }) {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 cursor-default bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b px-6">
          <span className="font-bold">BidVault</span>
          <button onClick={onClose} className="text-xl text-gray-500" aria-label="Close sidebar">
            ×
          </button>
        </div>

        <nav className="space-y-1 p-4">
          <Link href="/auctions" onClick={onClose} className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
            Browse Auctions
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/auctions/create" onClick={onClose} className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
                Create Auction
              </Link>
              <Link href="/dashboard" onClick={onClose} className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
                Dashboard
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
