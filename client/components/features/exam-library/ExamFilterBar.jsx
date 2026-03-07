'use client';

import { useRef, useState, useEffect } from 'react';
import { TEST_CATEGORIES, SORT_OPTIONS, ICONS } from '@/shared/constants';

function SortDropdown({ sortBy, onSortChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = SORT_OPTIONS.find((o) => o.value === sortBy) ?? SORT_OPTIONS[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative min-w-[180px]">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center justify-between w-full h-12 px-4 rounded-lg border bg-gray-50 text-sm font-medium transition-all ${
          open
            ? 'border-primary ring-2 ring-primary/20 text-gray-900'
            : 'border-gray-200 text-gray-700 hover:border-primary/50'
        }`}
      >
        <span>{selected.label}</span>
        <ICONS.expandMore
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
          style={{ fontSize: '1.25rem' }}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className={`absolute right-0 z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-200 origin-top ${
          open
            ? 'opacity-100 scale-y-100 translate-y-0'
            : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'
        }`}
      >
        {SORT_OPTIONS.map((opt) => {
          const isActive = opt.value === sortBy;
          return (
            <button
              key={opt.value}
              onClick={() => { onSortChange(opt.value); setOpen(false); }}
              className={`flex items-center w-full px-4 py-2.5 text-sm text-left transition-colors ${
                isActive
                  ? 'bg-primary/5 text-primary font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ExamFilterBar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* Category Tabs */}
      <div className="flex border-b border-gray-200 gap-1 overflow-x-auto w-full lg:w-auto shrink-0">
        {TEST_CATEGORIES.map((cat) => {
          const isActive = activeTab === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onTabChange(cat.key)}
              className={`flex items-center justify-center border-b-[3px] pb-3 pt-2 px-4 text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'border-b-primary text-primary'
                  : 'border-b-transparent text-gray-500 hover:text-primary'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Search + Sort */}
      <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px] group">
          <ICONS.search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
            style={{ fontSize: '1.25rem' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tests by title or keyword..."
            className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>

        {/* Sort Dropdown */}
        <SortDropdown sortBy={sortBy} onSortChange={onSortChange} />
      </div>
    </div>
  );
}
