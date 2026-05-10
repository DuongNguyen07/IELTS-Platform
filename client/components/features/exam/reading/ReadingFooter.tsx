'use client';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { ReadingExam } from '@/shared/data/exams/reading/types';

interface Props {
  exam: ReadingExam;
  activePartIndex: number;
  answers: Record<number, string>;
  flagged: Set<number>;
  onPartChange: (index: number) => void;
  onScrollToQuestion: (questionNumber: number) => void;
}

export default function ReadingFooter({
  exam,
  activePartIndex,
  answers,
  flagged,
  onPartChange,
  onScrollToQuestion,
}: Props) {
  const activePart = exam.parts[activePartIndex];

  // Build the array of question numbers for the current part
  const questionNumbers: number[] = [];
  for (let n = activePart.questionRange.from; n <= activePart.questionRange.to; n++) {
    questionNumbers.push(n);
  }

  const canGoPrev = activePartIndex > 0;
  const canGoNext = activePartIndex < exam.parts.length - 1;

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-3 flex-shrink-0 z-10">
      {/* Row 1: Part tabs with answered counts */}
      <div className="flex items-center gap-1 mb-2.5">
        {exam.parts.map((part, idx) => {
          const total = part.questionRange.to - part.questionRange.from + 1;
          const answered = Object.keys(answers).filter(
            (k) => +k >= part.questionRange.from && +k <= part.questionRange.to
          ).length;
          const isActive = idx === activePartIndex;

          return (
            <button
              key={part.partNumber}
              onClick={() => onPartChange(idx)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Part {part.partNumber}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {answered}/{total}
              </span>
            </button>
          );
        })}

        {/* Total progress */}
        <span className="ml-auto text-xs text-gray-500">
          Total:{' '}
          <span className="font-semibold text-gray-700">{Object.keys(answers).length}</span>/
          {exam.totalQuestions}
        </span>
      </div>

      {/* Row 2: Question number buttons + Prev/Next */}
      <div className="flex items-center gap-3">
        {/* Prev part */}
        <button
          onClick={() => canGoPrev && onPartChange(activePartIndex - 1)}
          disabled={!canGoPrev}
          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
            canGoPrev
              ? 'bg-navy text-white hover:bg-navy/80'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          <ChevronLeftIcon style={{ fontSize: '1.25rem' }} />
        </button>

        {/* Question number grid */}
        <div className="flex flex-wrap gap-1 flex-1">
          {questionNumbers.map((n) => {
            const isAnswered = n in answers;
            const isFlagged = flagged.has(n);

            let cls = 'bg-white border border-gray-300 text-gray-600 hover:border-primary/60';
            if (isFlagged && !isAnswered) cls = 'bg-amber-400 border-amber-400 text-white';
            else if (isAnswered) cls = 'bg-primary border-primary text-white';

            return (
              <button
                key={n}
                onClick={() => onScrollToQuestion(n)}
                className={`w-8 h-8 rounded text-xs font-semibold transition-colors flex items-center justify-center ${cls}`}
              >
                {n}
              </button>
            );
          })}
        </div>

        {/* Next part */}
        <button
          onClick={() => canGoNext && onPartChange(activePartIndex + 1)}
          disabled={!canGoNext}
          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
            canGoNext
              ? 'bg-navy text-white hover:bg-navy/80'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          <ChevronRightIcon style={{ fontSize: '1.25rem' }} />
        </button>
      </div>
    </footer>
  );
}
