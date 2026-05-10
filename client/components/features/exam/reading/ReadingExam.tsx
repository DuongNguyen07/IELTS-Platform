'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { ReadingExam as ReadingExamData } from '@/shared/data/exams/reading/types';
import ReadingHeader from './ReadingHeader';
import ReadingPassage from './ReadingPassage';
import ReadingQuestions from './ReadingQuestions';
import ReadingFooter from './ReadingFooter';

interface Props {
  exam: ReadingExamData;
  testMode?: 'timed' | 'practice';
}

export default function ReadingExam({ exam, testMode = 'timed' }: Props) {
  const router = useRouter();
  const [activePartIndex, setActivePartIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(
    testMode === 'timed' ? exam.durationMins * 60 : Infinity
  );

  const questionsRef = useRef<HTMLDivElement>(null);

  // ── Countdown timer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (testMode !== 'timed' || !isFinite(timeLeft) || timeLeft <= 0) return;

    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          // Auto-submit when time runs out
          router.push('/exam-library');
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testMode]);

  // ── Handlers ────────────────────────────────────────────────────────────
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

  const handleScrollToQuestion = useCallback(
    (num: number) => {
      // Switch to the part that contains this question
      const partIdx = exam.parts.findIndex(
        (p) => num >= p.questionRange.from && num <= p.questionRange.to
      );
      if (partIdx !== -1) setActivePartIndex(partIdx);

      // Scroll the questions panel to that element after render
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
    },
    [exam.parts]
  );

  const handleSubmit = useCallback(() => {
    // TODO: route to results page, passing answers
    router.push('/exam-library');
  }, [router]);

  // ── Derived state ────────────────────────────────────────────────────────
  const activePart = exam.parts[activePartIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      {/* Header */}
      <ReadingHeader
        examTitle={exam.title}
        parts={exam.parts}
        activePartIndex={activePartIndex}
        timeLeft={timeLeft}
        testMode={testMode}
        answeredCount={answeredCount}
        totalQuestions={exam.totalQuestions}
        onSubmit={handleSubmit}
      />

      {/* Split panel */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left — Reading passage (55%) */}
        <ReadingPassage
          passage={activePart.passage}
          partNumber={activePart.partNumber}
        />

        {/* Right — Questions (45%) */}
        <ReadingQuestions
          ref={questionsRef}
          part={activePart}
          answers={answers}
          flagged={flagged}
          onAnswer={handleAnswer}
          onToggleFlag={handleToggleFlag}
        />
      </div>

      {/* Footer */}
      <ReadingFooter
        exam={exam}
        activePartIndex={activePartIndex}
        answers={answers}
        flagged={flagged}
        onPartChange={setActivePartIndex}
        onScrollToQuestion={handleScrollToQuestion}
      />
    </div>
  );
}
