'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { ReadingExam as ReadingExamData, ReadingPart } from '@/shared/data/exams/reading/types';
import ReadingHeader from './ReadingHeader';
import ReadingPassage from './ReadingPassage';
import ReadingQuestions from './ReadingQuestions';
import ReadingFooter from './ReadingFooter';
import ExamToolsSidebar from './ExamToolsSidebar';

interface Props {
  exam: ReadingExamData;
  testMode?: 'timed' | 'practice';
  selectedParts?: number[];
}

export default function ReadingExam({ exam, testMode = 'timed', selectedParts = [1, 2, 3] }: Props) {
  const router = useRouter();

  const filteredParts = exam.parts.filter((p) => selectedParts.includes(p.partNumber));
  const timedDurationSecs = Math.round(exam.durationMins * filteredParts.length / exam.parts.length) * 60;

  const [activePartIndex, setActivePartIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(testMode === 'timed' ? timedDurationSecs : Infinity);

  // Resizable panels
  const [passageWidthPct, setPassageWidthPct] = useState(50);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
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

  // ── Resizer drag ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Subtract sidebar (80px) and resizer (8px) from available width
      const available = rect.width - 80 - 8;
      const passagePx = e.clientX - rect.left - 80;
      const pct = Math.max(25, Math.min(75, (passagePx / available) * 100));
      setPassageWidthPct(pct);
    };
    const onMouseUp = () => { isDragging.current = false; };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

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
      const partIdx = filteredParts.findIndex(
        (p) => num >= p.questionRange.from && num <= p.questionRange.to
      );
      if (partIdx !== -1) setActivePartIndex(partIdx);
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
    [filteredParts]
  );

  const handleSubmit = useCallback(() => {
    router.push('/exam-library');
  }, [router]);

  const activePart = filteredParts[activePartIndex];

  const filteredTotalQuestions = filteredParts.reduce(
    (sum, p) => sum + (p.questionRange.to - p.questionRange.from + 1), 0
  );
  const filteredExam: ReadingExamData = {
    ...exam,
    parts: filteredParts as unknown as [ReadingPart, ReadingPart, ReadingPart],
    totalQuestions: filteredTotalQuestions,
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-exam-bg">
      <ReadingHeader
        examTitle={exam.title}
        timeLeft={timeLeft}
        testMode={testMode}
      />

      {/* Main split area */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden min-h-0">
        {/* Tools sidebar */}
        <ExamToolsSidebar />

        {/* Reading passage */}
        <ReadingPassage
          passage={activePart.passage}
          partNumber={activePart.partNumber}
          style={{ width: `${passageWidthPct}%`, flexShrink: 0 }}
        />

        {/* Drag resizer */}
        <div
          onMouseDown={() => { isDragging.current = true; }}
          className="w-2 bg-gray-100 border-x border-gray-300 cursor-col-resize hover:bg-slate-200 transition-colors flex items-center justify-center flex-shrink-0 select-none"
          title="Drag to resize"
        >
          <div className="h-10 flex flex-col justify-center items-center gap-1">
            <span className="w-0.5 h-0.5 rounded-full bg-slate-400" />
            <span className="w-0.5 h-0.5 rounded-full bg-slate-400" />
            <span className="w-0.5 h-0.5 rounded-full bg-slate-400" />
          </div>
        </div>

        {/* Questions panel */}
        <ReadingQuestions
          ref={questionsRef}
          part={activePart}
          answers={answers}
          flagged={flagged}
          onAnswer={handleAnswer}
          onToggleFlag={handleToggleFlag}
        />
      </div>

      <ReadingFooter
        exam={filteredExam}
        activePartIndex={activePartIndex}
        answers={answers}
        flagged={flagged}
        onPartChange={setActivePartIndex}
        onScrollToQuestion={handleScrollToQuestion}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
