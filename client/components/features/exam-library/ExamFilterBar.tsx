'use client';

import { type ChangeEvent } from 'react';
import { TEST_CATEGORIES, SORT_OPTIONS, ICONS } from '@/shared/constants';
import SortDropdown from '@/components/ui/SortDropdown';

interface ExamFilterBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function ExamFilterBar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: ExamFilterBarProps) {
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            placeholder="Search tests by title or keyword..."
            className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>

        {/* Sort Dropdown */}
        <SortDropdown options={SORT_OPTIONS} value={sortBy} onChange={onSortChange} />
      </div>
    </div>
  );
}
