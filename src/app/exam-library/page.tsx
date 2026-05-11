'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import LoadingState from '@/components/ui/LoadingState';
import ExamFilterBar from '@/components/features/exam-library/ExamFilterBar';
import TestGrid from '@/components/features/exam-library/TestGrid';
import Pagination from '@/components/features/exam-library/Pagination';

import {
  EXAM_LIBRARY_TESTS,
  DIFFICULTY_ORDER,
  TESTS_PER_PAGE,
} from '@/shared/constants';

export default function ExamLibraryPage() {
  const { status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);

  // Auth guard - redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  const filteredTests = useMemo(() => {
    let result = [...EXAM_LIBRARY_TESTS];

    // Tab filter
    if (activeTab !== 'all') {
      result = result.filter((t) => t.type === activeTab);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }

    // Sort
    if (sortBy === 'difficulty_high') {
      result.sort((a, b) => DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty]);
    } else if (sortBy === 'difficulty_low') {
      result.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
    } else if (sortBy === 'time') {
      result.sort((a, b) => a.durationMins - b.durationMins);
    }

    return result;
  }, [activeTab, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredTests.length / TESTS_PER_PAGE);
  const pagedTests = filteredTests.slice(
    (currentPage - 1) * TESTS_PER_PAGE,
    currentPage * TESTS_PER_PAGE,
  );

  if (status === 'loading') return <LoadingState message="Loading exam library..." />;
  if (status === 'unauthenticated') return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Container>
          <div className="py-10 flex flex-col gap-8">

            {/* Page Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-gray-900 text-4xl font-black tracking-tight">
                Exam Test Library
              </h1>
              <p className="text-gray-500 text-lg">
                Prepare for excellence with our curated collection of IELTS practice materials.
              </p>
            </div>

            {/* Filters */}
            <ExamFilterBar
              activeTab={activeTab}
              onTabChange={(tab: string) => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              searchQuery={searchQuery}
              onSearchChange={(q: string) => {
                setSearchQuery(q);
                setCurrentPage(1);
              }}
              sortBy={sortBy}
              onSortChange={(sort: string) => {
                setSortBy(sort);
                setCurrentPage(1);
              }}
            />

            {/* Results count */}
            <p className="text-sm text-gray-400 -mb-2">
              {filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''} found
            </p>

            {/* Grid */}
            <TestGrid tests={pagedTests} />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
