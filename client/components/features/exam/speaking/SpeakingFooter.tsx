'use client';

import { useState } from 'react';
import type { SpeakingExam } from '@/shared/data/exams/speaking/types';

interface Props {
  exam: SpeakingExam;
  activePartIndex: number;
  activeQuestionIndex: number;
  answered: Set<string>;
  onFinish: () => void;
}

export default function SpeakingFooter({
  exam, activePartIndex, activeQuestionIndex, answered, onFinish,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const totalQ = exam.parts.reduce((s, p) => s + p.questions.length, 0);
  const totalAnswered = answered.size;

  return (
    <>
      <footer className="h-16 bg-white border-t border-gray-200 px-4 flex items-center justify-between flex-shrink-0 z-10">
        {/* Part groups */}
        <div className="flex items-center gap-2">
          {exam.parts.map((part, partIdx) => {
            const isActivePart = partIdx === activePartIndex;
            return (
              <div
                key={part.partNumber}
                className={`flex items-center gap-1 rounded-lg px-2 py-1.5 border transition-colors ${
                  isActivePart
                    ? 'border-2 border-primary bg-white'
                    : 'border border-gray-200 bg-exam-bg'
                }`}
              >
                <span className={`text-[10px] font-bold mr-1 ${isActivePart ? 'text-primary' : 'text-gray-400'}`}>
                  P{part.partNumber}
                </span>
                {part.questions.map((q, qIdx) => {
                  const key = `p${partIdx}q${qIdx}`;
                  const isAnswered = answered.has(key);
                  const isCurrent = isActivePart && qIdx === activeQuestionIndex;
                  return (
                    <div
                      key={key}
                      className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded transition-colors ${
                        isAnswered
                          ? 'bg-success text-white'
                          : isCurrent
                          ? 'ring-2 ring-primary text-primary bg-white'
                          : 'text-gray-300'
                      }`}
                    >
                      {q.questionNumber}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Right: progress + finish */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 tabular-nums">
            {totalAnswered} / {totalQ} answered
          </span>
          <button
            onClick={() => setConfirmOpen(true)}
            className="h-10 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-full text-sm transition-colors"
          >
            Finish
          </button>
        </div>
      </footer>

      {confirmOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Submit speaking test?</h2>
            <p className="text-gray-600 text-sm mb-1">
              You have completed{' '}
              <span className="font-semibold text-primary">{totalAnswered}</span> of{' '}
              <span className="font-semibold">{totalQ}</span> questions.
            </p>
            {totalAnswered < totalQ && (
              <p className="text-red-500 text-sm mt-1">
                {totalQ - totalAnswered} question{totalQ - totalAnswered > 1 ? 's' : ''} not yet answered.
              </p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 h-11 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Continue Test
              </button>
              <button
                onClick={() => { setConfirmOpen(false); onFinish(); }}
                className="flex-1 h-11 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
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
