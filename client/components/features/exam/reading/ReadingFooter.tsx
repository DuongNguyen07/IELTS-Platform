'use client';

import { useState } from 'react';
import type { ReadingExam } from '@/shared/data/exams/reading/types';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
interface Props {
  exam: ReadingExam;
  activePartIndex: number;
  answers: Record<number, string>;
  flagged: Set<number>;
  onPartChange: (index: number) => void;
  onScrollToQuestion: (questionNumber: number) => void;
  onSubmit: () => void;
}

export default function ReadingFooter({
  exam,
  activePartIndex,
  answers,
  flagged,
  onPartChange,
  onScrollToQuestion,
  onSubmit,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const answeredCount = Object.keys(answers).length;
  const unanswered = exam.totalQuestions - answeredCount;
  const canGoPrev = activePartIndex > 0;
  const canGoNext = activePartIndex < exam.parts.length - 1;

  return (
    <>
      <footer className="h-16 bg-white border-t border-gray-200 px-4 flex items-center justify-between flex-shrink-0 z-10">
        {/* All 3 part groups */}
        <div className="flex items-center gap-4">
          {exam.parts.map((part, idx) => {
            const isActive = idx === activePartIndex;
            const nums: number[] = [];
            for (let n = part.questionRange.from; n <= part.questionRange.to; n++) nums.push(n);

            return (
              <div
                key={part.partNumber}
                onClick={() => onPartChange(idx)}
                className={`flex items-center rounded-md p-1 cursor-pointer transition-colors ${
                  isActive
                    ? 'border-2 border-success bg-white'
                    : 'border border-gray-200 bg-exam-bg hover:border-success/40'
                }`}
              >
                <div className="flex gap-1 px-1">
                  {nums.map((n) => {
                    const isAnswered = n in answers;
                    const isFlagged = flagged.has(n);
                    return (
                      <button
                        key={n}
                        onClick={(e) => { e.stopPropagation(); onScrollToQuestion(n); }}
                        className={`w-6 h-6 flex items-center justify-center text-[11px] font-bold rounded transition-colors ${
                          isFlagged && !isAnswered
                            ? 'bg-amber-400 text-white'
                            : isAnswered
                            ? 'bg-success text-white'
                            : isActive
                            ? 'text-success hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: prev / next + Finish */}
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <button
              onClick={() => canGoPrev && onPartChange(activePartIndex - 1)}
              disabled={!canGoPrev}
              className="w-10 h-10 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowBackIosNewIcon />
            </button>
            <button
              onClick={() => canGoNext && onPartChange(activePartIndex + 1)}
              disabled={!canGoNext}
              className="w-10 h-10 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowForwardIosIcon />
            </button>
          </div>
          <button
            onClick={() => setConfirmOpen(true)}
            className="h-10 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-full text-sm transition-colors"
          >
            Finish
          </button>
        </div>
      </footer>

      {/* Submit confirmation modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Submit your test?</h2>
            <p className="text-gray-600 text-sm mb-1">
              You have answered{' '}
              <span className="font-semibold text-primary">{answeredCount}</span> of{' '}
              <span className="font-semibold">{exam.totalQuestions}</span> questions.
            </p>
            {unanswered > 0 && (
              <p className="text-red-500 text-sm mt-1">
                {unanswered} question{unanswered > 1 ? 's' : ''}  unanswered.
              </p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 h-11 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Continue Test
              </button>
              <button
                onClick={() => { setConfirmOpen(false); onSubmit(); }}
                className="flex-1 h-11 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-opacity"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
