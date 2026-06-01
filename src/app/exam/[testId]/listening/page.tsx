'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import LoadingState from '@/components/ui/LoadingState';
import ListeningExam from '@/components/features/exam/listening/ListeningExam';
import type { ListeningExam as ListeningExamData } from '@/shared/data/exams/listening/types';

export default function ListeningExamPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const testId = Array.isArray(params?.testId) ? params.testId[0] : (params?.testId as string);
  const testMode = (searchParams?.get('mode') ?? 'timed') as 'timed' | 'practice';
  const rawSections = searchParams?.get('sections');
  const selectedSections = rawSections
    ? rawSections.split(',').map(Number).filter((n) => n >= 1 && n <= 4)
    : [1, 2, 3, 4];

  const [exam, setExam] = useState<ListeningExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }

    if (status === 'authenticated' && testId) {
      fetch(`/api/exams/listening/${testId}`)
        .then(async (res) => {
          if (!res.ok) { setNotFound(true); setLoading(false); return; }
          const data = await res.json();
          setExam(data as ListeningExamData);
          setLoading(false);
        })
        .catch(() => { setNotFound(true); setLoading(false); });
    }
  }, [status, testId, router]);

  if (status === 'loading' || loading) return <LoadingState message="Loading exam…" />;
  if (status === 'unauthenticated') return null;

  if (notFound || !exam) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Exam not found or not yet published.</p>
        <Link href="/exam-library" className="text-primary font-semibold hover:underline text-sm">
          ← Back to Exam Library
        </Link>
      </div>
    );
  }

  return <ListeningExam exam={exam} testMode={testMode} selectedSections={selectedSections} />;
}
