'use client';

import { useState } from 'react';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

interface ExamRow {
  id: string;
  slug: string;
  skill: string;
  title: string;
  difficulty: string;
  totalQuestions: number;
  durationMins: number;
  isPublished: boolean;
  version: number;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Props { initialExams: ExamRow[] }

const SKILLS = ['All', 'Reading', 'Listening', 'Writing', 'Speaking'];

const STATUS_PILL: Record<string, string> = {
  Published: 'bg-emerald-50 text-emerald-700',
  Draft:     'bg-amber-50 text-amber-700',
};

const PAGE_SIZE = 10;

export default function ExamList({ initialExams }: Props) {
  const [exams, setExams]   = useState<ExamRow[]>(initialExams);
  const [busy, setBusy]     = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [skill, setSkill]   = useState('All');
  const [page, setPage]     = useState(1);

  const filtered = exams.filter((e) => {
    const matchSkill  = skill === 'All' || e.skill.toLowerCase() === skill.toLowerCase();
    const matchSearch = !search.trim() || e.title.toLowerCase().includes(search.toLowerCase()) || e.slug.includes(search.toLowerCase());
    return matchSkill && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const togglePublish = async (exam: ExamRow) => {
    setBusy(exam.id);
    try {
      const res = await fetch(`/api/admin/exams/${exam.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !exam.isPublished }),
      });
      if (res.ok) {
        setExams((prev) => prev.map((e) => e.id === exam.id ? { ...e, isPublished: !e.isPublished } : e));
      }
    } finally { setBusy(null); }
  };

  const deleteExam = async (exam: ExamRow) => {
    if (!confirm(`Delete "${exam.title}"? This cannot be undone.`)) return;
    setBusy(exam.id);
    try {
      const res = await fetch(`/api/admin/exams/${exam.id}`, { method: 'DELETE' });
      if (res.ok) setExams((prev) => prev.filter((e) => e.id !== exam.id));
    } finally { setBusy(null); }
  };

  const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="bg-white rounded-[0.625rem] border p-4 flex flex-col sm:flex-row gap-4" style={{ borderColor: 'var(--border)' }}>
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: '1rem' }} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search exams…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>

        {/* Skill segmented control */}
        <div className="flex items-center gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--muted)' }}>
          {SKILLS.map((s) => (
            <button
              key={s}
              onClick={() => { setSkill(s); setPage(1); }}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
              style={skill === s
                ? { backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', color: 'oklch(0.129 0.042 264.695)' }
                : { color: 'var(--muted-foreground)' }
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[0.625rem] border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        {paged.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No exams match your filters.</p>
            <Link href="/admin/exams/new" className="inline-block mt-4 text-sm font-semibold text-gray-900 underline">
              Upload your first exam
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider" style={{ backgroundColor: 'oklch(0.968 0.007 247.896 / 0.5)', color: 'var(--muted-foreground)' }}>
                  <th className="px-5 py-3 text-left font-semibold">Exam</th>
                  <th className="px-5 py-3 text-left font-semibold">Skill</th>
                  <th className="px-5 py-3 text-left font-semibold">Difficulty</th>
                  <th className="px-5 py-3 text-left font-semibold">Questions</th>
                  <th className="px-5 py-3 text-left font-semibold">Duration</th>
                  <th className="px-5 py-3 text-left font-semibold">Status</th>
                  <th className="px-5 py-3 text-left font-semibold">Updated</th>
                  <th className="px-5 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {paged.map((exam) => {
                  const status = exam.isPublished ? 'Published' : 'Draft';
                  return (
                    <tr key={exam.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-900">{exam.title}</p>
                        <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>/{exam.slug}</p>
                      </td>
                      <td className="px-5 py-3.5 capitalize text-gray-700">{exam.skill}</td>
                      <td className="px-5 py-3.5 capitalize text-gray-700">{exam.difficulty}</td>
                      <td className="px-5 py-3.5 text-gray-700">{exam.totalQuestions} questions</td>
                      <td className="px-5 py-3.5 text-gray-700">{exam.durationMins} mins</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_PILL[status]}`}>{status}</span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{fmt(exam.updatedAt)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => togglePublish(exam)}
                            disabled={busy === exam.id}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
                            title={exam.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            <VisibilityIcon style={{ fontSize: '1rem', color: exam.isPublished ? 'oklch(0.62 0.18 255)' : 'oklch(0.554 0.046 257.417)' }} />
                          </button>
                          <Link href={`/admin/exams/new`} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                            <EditIcon style={{ fontSize: '1rem', color: 'oklch(0.554 0.046 257.417)' }} />
                          </Link>
                          <button
                            onClick={() => deleteExam(exam)}
                            disabled={busy === exam.id}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40"
                          >
                            <DeleteIcon style={{ fontSize: '1rem', color: 'oklch(0.577 0.245 27.325)' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Footer */}
            <div className="px-5 py-3 flex items-center justify-between border-t text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              <span>Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--border)' }}
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--border)' }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
