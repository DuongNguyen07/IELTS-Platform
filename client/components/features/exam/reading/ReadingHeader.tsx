'use client';

import { useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { ReadingPart } from '@/shared/data/exams/reading/types';

interface Props {
  examTitle: string;
  parts: ReadingPart[];
  activePartIndex: number;
  timeLeft: number;
  testMode: 'timed' | 'practice';
  answeredCount: number;
  totalQuestions: number;
  onSubmit: () => void;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '∞';
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function ReadingHeader({
  examTitle,
  parts,
  activePartIndex,
  timeLeft,
  testMode,
  answeredCount,
  totalQuestions,
  onSubmit,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isLowTime = isFinite(timeLeft) && timeLeft < 300;
  const unanswered = totalQuestions - answeredCount;

  return (
    <>
      <header className="bg-navy text-white h-16 flex items-center px-6 gap-4 flex-shrink-0 z-10 shadow-lg">
        {/* Left: title */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium hidden sm:block">
            IELTS Academic Reading
          </p>
          <h1 className="text-sm font-bold text-white truncate">{examTitle}</h1>
        </div>

        {/* Center: part tabs */}
        <nav className="flex gap-1 flex-shrink-0">
          {parts.map((part, idx) => (
            <div
              key={part.partNumber}
              className={`px-4 py-1.5 rounded text-sm font-semibold transition-colors ${
                activePartIndex === idx
                  ? 'bg-primary text-white'
                  : 'text-gray-400 cursor-default'
              }`}
            >
              Part {part.partNumber}
            </div>
          ))}
        </nav>

        {/* Right: progress + timer + submit */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="text-sm text-gray-400 hidden md:block">
            {answeredCount}/{totalQuestions} answered
          </span>

          {testMode === 'timed' ? (
            <div
              className={`flex items-center gap-1.5 font-mono font-bold text-sm ${
                isLowTime ? 'text-red-400' : 'text-white'
              }`}
            >
              <AccessTimeIcon style={{ fontSize: '1rem' }} />
              {formatTime(timeLeft)}
            </div>
          ) : (
            <span className="text-xs font-medium bg-teal/20 text-teal px-2.5 py-1 rounded-full">
              Practice Mode
            </span>
          )}

          <button
            onClick={() => setConfirmOpen(true)}
            className="h-9 px-5 rounded-lg bg-teal text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Submit
          </button>
        </div>
      </header>

      {/* Submit confirmation modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Submit your test?</h2>
            <p className="text-gray-600 text-sm mb-1">
              You have answered{' '}
              <span className="font-semibold text-primary">{answeredCount}</span> of{' '}
              <span className="font-semibold">{totalQuestions}</span> questions.
            </p>
            {unanswered > 0 && (
              <p className="text-amber-600 text-sm mt-1">
                {unanswered} question{unanswered > 1 ? 's' : ''} still unanswered.
              </p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 h-11 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
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
