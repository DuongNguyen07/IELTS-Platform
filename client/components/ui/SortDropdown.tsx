'use client';

import { useRef, useState, useEffect } from 'react';
import { ICONS } from '@/shared/constants';

interface SortOption {
  value: string;
  label: string;
}

interface Props {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function SortDropdown({ options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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
        {options.map((opt) => {
          const isActive = opt.value === value;
          return (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
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
