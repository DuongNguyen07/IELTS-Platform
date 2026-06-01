'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LoadingState from '@/components/ui/LoadingState';
import WritingExam from '@/components/features/exam/writing/WritingExam';
import type { WritingExam as WritingExamData } from '@/shared/data/exams/writing/types';

export default function WritingExamPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const testId = Array.isArray(params?.testId) ? params.testId[0] : (params?.testId as string);
  const testMode = (searchParams?.get('mode') ?? 'timed') as 'timed' | 'practice';

  const [exam, setExam] = useState<WritingExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status === 'authenticated' && testId) {
      fetch(`/api/exams/writing/${testId}`)
        .then(async (res) => {
          if (!res.ok) { setNotFound(true); setLoading(false); return; }
          const data = await res.json();
          setExam(data as WritingExamData);
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

  return <WritingExam exam={exam} testMode={testMode} />;
}
