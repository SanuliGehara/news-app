"use client";
import React from "react";
import { AiOutlineFilter } from "react-icons/ai";

interface SidebarFilterProps {
  category: string;
  setCategory: (cat: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  categories: { label: string; value: string }[];
  sortOptions: { label: string; value: string }[];
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({ category, setCategory, sortBy, setSortBy, categories, sortOptions }) => (
  <aside className="w-full sm:w-72 h-auto max-h-fit bg-white/95 rounded-2xl shadow-xl p-6 border border-maroon/10 flex flex-col gap-4 items-start mb-6 sm:mb-0">
    {/* Heading with filter icon */}
    <div className="flex items-center gap-2 mb-2">
      <AiOutlineFilter className="text-maroon text-xl" />
      <span className="text-maroon font-bold text-lg tracking-wide">Filter</span>
    </div>
    {/* Category buttons */}
    <div className="flex flex-wrap gap-2">
      {categories.map(cat => (
        <button
          key={cat.value}
          className={`px-4 py-1 rounded-full font-semibold text-xs transition border
            ${category === cat.value
              ? "bg-maroon text-white border-maroon shadow"
              : "bg-white text-maroon border-maroon hover:bg-maroon/10"}
          `}
          onClick={() => setCategory(cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </div>
    {/* Sort By select */}
    <div className="flex flex-col mt-4">
      <label htmlFor="sortBy" className="text-maroon font-semibold mb-1">Sort By</label>
      <select
        id="sortBy"
        className="border border-maroon/30 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-maroon w-full min-w-[120px] bg-white"
        value={sortBy}
        onChange={e => setSortBy(e.target.value)}
      >
        {sortOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  </aside>
);

export default SidebarFilter;
