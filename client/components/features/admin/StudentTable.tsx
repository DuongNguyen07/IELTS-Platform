'use client';

import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export type StudentRow = {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Pending';
  attempts: number;
  band: number;
  joined: string;
};

interface Props { students: StudentRow[] }

type TabFilter = 'All' | 'Active' | 'Inactive' | 'Pending';
const TABS: TabFilter[] = ['All', 'Active', 'Inactive', 'Pending'];

const STATUS_PILL: Record<string, string> = {
  Active:   'bg-emerald-50 text-emerald-700',
  Inactive: 'bg-gray-100 text-gray-500',
  Pending:  'bg-amber-50 text-amber-700',
};

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function StudentTable({ students }: Props) {
  const [tab, setTab]       = useState<TabFilter>('All');
  const [search, setSearch] = useState('');

  const filtered = students.filter((s) => {
    const matchTab    = tab === 'All' || s.status === tab;
    const matchSearch = !search.trim() ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const active  = students.filter((s) => s.status === 'Active').length;
  const pending = students.filter((s) => s.status === 'Pending').length;
  const withBand = students.filter((s) => s.band > 0);
  const avgBand  = withBand.length
    ? (withBand.reduce((a, s) => a + s.band, 0) / withBand.length).toFixed(1)
    : '—';

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Students', value: students.length },
          { label: 'Active',         value: active },
          { label: 'Pending',        value: pending },
          { label: 'Avg Band Score', value: avgBand },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-[0.625rem] border p-5" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-[0.625rem] border p-4 flex flex-col sm:flex-row gap-4" style={{ borderColor: 'var(--border)' }}>
        <div className="relative flex-1 max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: '1rem' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--muted)' }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
              style={tab === t
                ? { backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', color: 'oklch(0.129 0.042 264.695)' }
                : { color: 'var(--muted-foreground)' }
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[0.625rem] border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        {filtered.length === 0 ? (
          <p className="text-sm text-center py-16" style={{ color: 'var(--muted-foreground)' }}>
            {students.length === 0 ? 'No students have registered yet.' : 'No students match your filters.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider" style={{ backgroundColor: 'oklch(0.968 0.007 247.896 / 0.5)', color: 'var(--muted-foreground)' }}>
                  <th className="px-5 py-3 text-left font-semibold">Student</th>
                  <th className="px-5 py-3 text-left font-semibold">Status</th>
                  <th className="px-5 py-3 text-left font-semibold">Attempts</th>
                  <th className="px-5 py-3 text-left font-semibold">Latest Band</th>
                  <th className="px-5 py-3 text-left font-semibold">Joined</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                          style={{ backgroundColor: 'oklch(0.62 0.18 255 / 0.12)', color: 'oklch(0.62 0.18 255)' }}
                        >
                          {initials(s.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{s.name}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_PILL[s.status]}`}>{s.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{s.attempts}</td>
                    <td className="px-5 py-3.5 text-gray-700">{s.band > 0 ? s.band.toFixed(1) : '—'}</td>
                    <td className="px-5 py-3.5" style={{ color: 'var(--muted-foreground)' }}>{fmt(s.joined)}</td>
                    <td className="px-5 py-3.5">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreHorizIcon style={{ fontSize: '1.1rem', color: 'var(--muted-foreground)' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
