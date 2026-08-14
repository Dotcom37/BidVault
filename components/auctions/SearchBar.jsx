"use client";

import { useState } from "react";

export default function SearchBar({ initialValue = "", onSearch }) {
  const [query, setQuery] = useState(initialValue);

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="mx-auto mb-10 flex max-w-2xl gap-3">
      <input
        type="text"
        placeholder="Search auctions..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 rounded-full border border-gray-300 px-5 py-3 outline-none focus:ring-2 focus:ring-black"
      />

      <button
        type="button"
        onClick={handleSearch}
        className="rounded-full bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
      >
        Search
      </button>
    </div>
  );
}