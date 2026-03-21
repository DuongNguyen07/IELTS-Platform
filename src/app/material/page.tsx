'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import LoadingState from '@/components/ui/LoadingState';
import SortDropdown from '@/components/ui/SortDropdown';
import Pagination from '@/components/features/exam-library/Pagination';

import MaterialSidebar from '@/components/features/material/MaterialSidebar';
import MaterialCard from '@/components/features/material/MaterialCard';

import {
  MATERIAL_ITEMS,
  MATERIALS_PER_PAGE,
  SORT_OPTIONS,
  filterAndSort,
} from '@/components/features/material/constants';
import type { MaterialCategory, MaterialFormat, MaterialLevel } from '@/components/features/material/types';

export default function MaterialPage() {
  const { status } = useSession();
  const router = useRouter();

  // ── Filter state ────────────────────────────────────────────────────────────
  const [search, setSearch]               = useState('');
  const [activeCategory, setActiveCategory] = useState<MaterialCategory | 'all'>('all');
  const [activeLevels, setActiveLevels]   = useState<Set<MaterialLevel>>(new Set());
  const [activeFormats, setActiveFormats] = useState<Set<MaterialFormat>>(new Set());
  const [sort, setSort]                   = useState('newest');
  const [currentPage, setCurrentPage]     = useState(1);

  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  // ── Toggle helpers ──────────────────────────────────────────────────────────
  const toggleLevel = (level: MaterialLevel) => {
    setActiveLevels((prev) => {
      const next = new Set(prev);
      next.has(level) ? next.delete(level) : next.add(level);
      return next;
    });
    setCurrentPage(1);
  };

  const toggleFormat = (format: MaterialFormat) => {
    setActiveFormats((prev) => {
      const next = new Set(prev);
      next.has(format) ? next.delete(format) : next.add(format);
      return next;
    });
    setCurrentPage(1);
  };

  // ── Derived data ────────────────────────────────────────────────────────────
  const filtered = useMemo(
    () => filterAndSort(MATERIAL_ITEMS, { search, category: activeCategory, levels: activeLevels, formats: activeFormats, sort }),
    [search, activeCategory, activeLevels, activeFormats, sort]
  );

  const totalPages  = Math.ceil(filtered.length / MATERIALS_PER_PAGE);
  const pagedItems  = filtered.slice((currentPage - 1) * MATERIALS_PER_PAGE, currentPage * MATERIALS_PER_PAGE);

  const categoryLabel = activeCategory === 'all' ? 'resources' : activeCategory;

  if (status === 'loading') return <LoadingState message="Loading study materials..." />;
  if (status === 'unauthenticated') return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <Container>
          <div className="py-10">

            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-gray-900 text-4xl font-black tracking-tight mb-2">Study Materials</h1>
              <p className="text-gray-500 text-lg">
                Browse over {MATERIAL_ITEMS.length}+ curated IELTS resources to boost your score.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

              {/* Sidebar */}
              <MaterialSidebar
                search={search}
                onSearchChange={(v) => { setSearch(v); setCurrentPage(1); }}
                activeCategory={activeCategory}
                onCategoryChange={(c) => { setActiveCategory(c); setCurrentPage(1); }}
                activeLevels={activeLevels}
                onLevelToggle={toggleLevel}
                activeFormats={activeFormats}
                onFormatToggle={toggleFormat}
              />

              {/* Main content */}
              <section className="flex-1 min-w-0">

                {/* Results bar */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-gray-500 font-medium">
                    Showing {pagedItems.length} of {filtered.length} {categoryLabel}
                  </p>
                  <SortDropdown
                    options={SORT_OPTIONS}
                    value={sort}
                    onChange={(v) => { setSort(v); setCurrentPage(1); }}
                  />
                </div>

                {/* Grid */}
                {pagedItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pagedItems.map((item) => (
                      <MaterialCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
                    No materials match your filters.
                  </div>
                )}

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />

              </section>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
