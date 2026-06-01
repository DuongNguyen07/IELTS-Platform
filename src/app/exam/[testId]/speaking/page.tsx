'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import LoadingState from '@/components/ui/LoadingState';
import SpeakingExam from '@/components/features/exam/speaking/SpeakingExam';
import type { SpeakingExam as SpeakingExamData } from '@/shared/data/exams/speaking/types';

export default function SpeakingExamPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();

  const testId = Array.isArray(params?.testId) ? params.testId[0] : (params?.testId as string);

  const [exam, setExam] = useState<SpeakingExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status === 'authenticated' && testId) {
      fetch(`/api/exams/speaking/${testId}`)
        .then(async (res) => {
          if (!res.ok) { setNotFound(true); setLoading(false); return; }
          const data = await res.json();
          setExam(data as SpeakingExamData);
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

  return <SpeakingExam exam={exam} />;
}
