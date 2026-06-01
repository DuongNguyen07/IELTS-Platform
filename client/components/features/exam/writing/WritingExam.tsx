'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { WritingExam as WritingExamData } from '@/shared/data/exams/writing/types';
import ReadingHeader from '../reading/ReadingHeader';
import ExamToolsSidebar from '../reading/ExamToolsSidebar';
import WritingTaskPanel from './WritingTaskPanel';
import WritingEditor from './WritingEditor';
import WritingFooter from './WritingFooter';

interface Props {
  exam: WritingExamData;
  testMode?: 'timed' | 'practice';
}

export default function WritingExam({ exam, testMode = 'timed' }: Props) {
  const router = useRouter();
  const timedDurationSecs = exam.durationMins * 60;

  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({ 1: '', 2: '' });
  const [timeLeft, setTimeLeft] = useState(testMode === 'timed' ? timedDurationSecs : Infinity);

  const [panelWidthPct, setPanelWidthPct] = useState(50);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Countdown timer
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

  // Resizer drag — same logic as ReadingExam
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const available = rect.width - 80 - 8;
      const leftPx = e.clientX - rect.left - 80;
      const pct = Math.max(25, Math.min(75, (leftPx / available) * 100));
      setPanelWidthPct(pct);
    };
    const onMouseUp = () => { isDragging.current = false; };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleAnswer = useCallback((taskNumber: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [taskNumber]: value }));
  }, []);

  const activeTask = exam.tasks[activeTaskIndex];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-exam-bg">
      <ReadingHeader examTitle={exam.title} timeLeft={timeLeft} testMode={testMode} />

      <div ref={containerRef} className="flex flex-1 overflow-hidden min-h-0">
        <ExamToolsSidebar />

        <WritingTaskPanel
          task={activeTask}
          style={{ width: `${panelWidthPct}%`, flexShrink: 0 }}
        />

        {/* Drag resizer */}
        <div
          onMouseDown={() => { isDragging.current = true; }}
          className="w-2 bg-gray-100 border-x border-gray-300 cursor-col-resize hover:bg-slate-200 transition-colors flex items-center justify-center flex-shrink-0 select-none"
        >
          <div className="h-10 flex flex-col justify-center items-center gap-1">
            <span className="w-0.5 h-0.5 rounded-full bg-slate-400" />
            <span className="w-0.5 h-0.5 rounded-full bg-slate-400" />
            <span className="w-0.5 h-0.5 rounded-full bg-slate-400" />
          </div>
        </div>

        <WritingEditor
          taskNumber={activeTask.taskNumber}
          minWords={activeTask.minWords}
          value={answers[activeTask.taskNumber] ?? ''}
          onChange={(val) => handleAnswer(activeTask.taskNumber, val)}
        />
      </div>

      <WritingFooter
        exam={exam}
        activeTaskIndex={activeTaskIndex}
        answers={answers}
        onTaskChange={setActiveTaskIndex}
        onSubmit={() => router.push('/exam-library')}
      />
    </div>
  );
}
