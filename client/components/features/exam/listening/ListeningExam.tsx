'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { ListeningExam as ListeningExamData } from '@/shared/data/exams/listening/types';
import ListeningHeader from './ListeningHeader';
import ListeningAudioPlayer from './ListeningAudioPlayer';
import ListeningQuestions from './ListeningQuestions';
import ListeningFooter from './ListeningFooter';
import ExamToolsSidebar from '../reading/ExamToolsSidebar';

interface Props {
  exam: ListeningExamData;
  testMode?: 'timed' | 'practice';
  selectedSections?: number[];
}

export default function ListeningExam({ exam, testMode = 'timed', selectedSections = [1, 2, 3, 4] }: Props) {
  const router = useRouter();

  const filteredSections = exam.sections.filter((s) => selectedSections.includes(s.sectionNumber));
  const timedDurationSecs = Math.round(exam.durationMins * filteredSections.length / exam.sections.length) * 60;

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(testMode === 'timed' ? timedDurationSecs : Infinity);

  const questionsRef = useRef<HTMLDivElement>(null);

  // ── Countdown timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (testMode !== 'timed' || !isFinite(timeLeft) || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); router.push('/exam-library'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testMode]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleAnswer = useCallback((questionNumber: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionNumber]: value }));
  }, []);

  const handleToggleFlag = useCallback((questionNumber: number) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(questionNumber) ? next.delete(questionNumber) : next.add(questionNumber);
      return next;
    });
  }, []);

  const handleScrollToQuestion = useCallback((num: number) => {
    const sectionIdx = filteredSections.findIndex(
      (s) => num >= s.questionRange.from && num <= s.questionRange.to
    );
    if (sectionIdx !== -1) setActiveSectionIndex(sectionIdx);
    setTimeout(() => {
      if (questionsRef.current) {
        const el = questionsRef.current.querySelector<HTMLElement>(`[data-question="${num}"]`);
        if (el) {
          const panelTop = questionsRef.current.getBoundingClientRect().top;
          const elTop = el.getBoundingClientRect().top;
          questionsRef.current.scrollBy({ top: elTop - panelTop - 16, behavior: 'smooth' });
        }
      }
    }, 60);
  }, [filteredSections]);

  const handleSubmit = useCallback(() => {
    router.push('/exam-library');
  }, [router]);

  const activeSection = filteredSections[activeSectionIndex];

  const filteredTotalQuestions = filteredSections.reduce(
    (sum, s) => sum + (s.questionRange.to - s.questionRange.from + 1), 0
  );
  const filteredExam: ListeningExamData = {
    ...exam,
    sections: filteredSections as ListeningExamData['sections'],
    totalQuestions: filteredTotalQuestions,
  };

  if (!activeSection) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-exam-bg">
      <ListeningHeader
        examTitle={exam.title}
        timeLeft={timeLeft}
        testMode={testMode}
      />

      <div className="flex flex-1 overflow-hidden min-h-0 relative">
        <ExamToolsSidebar />

        <ListeningQuestions
          ref={questionsRef}
          section={activeSection}
          answers={answers}
          flagged={flagged}
          onAnswer={handleAnswer}
          onToggleFlag={handleToggleFlag}
        />

        <ListeningAudioPlayer
          audioUrl={activeSection.audioUrl}
          sectionNumber={activeSection.sectionNumber}
          testMode={testMode}
        />
      </div>

      <ListeningFooter
        exam={filteredExam}
        activeSectionIndex={activeSectionIndex}
        answers={answers}
        flagged={flagged}
        onSectionChange={setActiveSectionIndex}
        onScrollToQuestion={handleScrollToQuestion}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
