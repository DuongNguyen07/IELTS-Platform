'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import LoadingState from '@/components/ui/LoadingState';
import TestInfoCard from '@/components/features/pre-exam/TestInfoCard';
import TestPartsList from '@/components/features/pre-exam/TestPartsList';
import TestModeSelector from '@/components/features/pre-exam/TestModeSelector';
import InstructionsCard from '@/components/features/pre-exam/InstructionsCard';
import ExamCTA from '@/components/features/pre-exam/ExamCTA';
import Button from '@/client/components/ui/Button';

import { buildInitialParts, LEVEL_LABEL } from '@/components/features/pre-exam/constants';
import type { TestMode, TestPart } from '@/components/features/pre-exam/types';
import type { ExamTest } from '@/shared/constants';

export default function PreExamPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const slug = params?.testId as string;

  const [test, setTest] = useState<ExamTest | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [testMode, setTestMode] = useState<TestMode>('timed');
  const [testParts, setTestParts] = useState<TestPart[]>([]);

  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated' || !slug) return;
    fetch(`/api/exams/${slug}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data: ExamTest | null) => {
        if (!data) return;
        setTest(data);
        setTestParts(buildInitialParts(data));
      });
  }, [status, slug]);

  if (status === 'loading' || (!test && !notFound)) return <LoadingState message="Loading test details..." />;
  if (status === 'unauthenticated') return null;

  if (notFound || !test) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center flex flex-col gap-4">
            <p className="text-gray-500 text-lg">Test not found.</p>
            <Link href="/exam-library" className="text-primary font-semibold hover:underline">
              Back to Exam Library
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isGeneral = test.type === 'general';
  const levelLabel = LEVEL_LABEL[test.difficulty] ?? 'Academic';
  const totalDuration = testParts.filter((p) => p.checked).reduce((acc, p) => acc + p.duration, 0);

  const togglePart = (id: string) => {
    setTestParts((prev) =>
      prev.map((p) => (p.id === id && p.enabled ? { ...p, checked: !p.checked } : p))
    );
  };

  const handleStartTest = () => {
    const checkedNums = testParts
      .filter((p) => p.checked)
      .map((p) => { const m = p.id.match(/(\d+)$/); return m ? Number(m[1]) : null; })
      .filter((n): n is number => n !== null);

    if (test.type === 'reading') {
      const params = new URLSearchParams({ mode: testMode, parts: checkedNums.join(',') });
      router.push(`/exam/${slug}/reading?${params}`);
      return;
    }
    if (test.type === 'listening') {
      const params = new URLSearchParams({ mode: testMode, sections: checkedNums.join(',') });
      router.push(`/exam/${slug}/listening?${params}`);
      return;
    }
    console.warn('Exam type not yet implemented:', test.type);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Container>
          <div className="py-10 flex flex-col gap-8 max-w-3xl mx-auto">
            <Button
              variant="test"
              size="small"
              fullWidth={false}
              className="w-fit"
              onClick={() => router.push('/exam-library')}
            >
              <ArrowBackIcon style={{ fontSize: '1rem' }} />
              Back to Exam Library
            </Button>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-gray-900 text-4xl font-black tracking-tight leading-tight">
                {test.title}
              </h1>
              <span className="shrink-0 bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mt-1">
                {levelLabel}
              </span>
            </div>

            <TestInfoCard test={test} />

            <TestPartsList parts={testParts} isGeneral={isGeneral} onToggle={togglePart} />

            <TestModeSelector value={testMode} onChange={setTestMode} />

            <InstructionsCard />

            <ExamCTA totalDuration={totalDuration} onStart={handleStartTest} />

          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
