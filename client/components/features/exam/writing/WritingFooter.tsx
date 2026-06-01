'use client';

import { useState } from 'react';
import type { WritingExam } from '@/shared/data/exams/writing/types';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Props {
  exam: WritingExam;
  activeTaskIndex: number;
  answers: Record<number, string>;
  onTaskChange: (index: number) => void;
  onSubmit: () => void;
}

function countWords(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

export default function WritingFooter({ exam, activeTaskIndex, answers, onTaskChange, onSubmit }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const canGoPrev = activeTaskIndex > 0;
  const canGoNext = activeTaskIndex < exam.tasks.length - 1;
  const wordCounts = exam.tasks.map((t) => countWords(answers[t.taskNumber] ?? ''));
  const hasWarning = exam.tasks.some((t, i) => wordCounts[i] < t.minWords);

  return (
    <>
      <footer className="h-16 bg-white border-t border-gray-200 px-6 flex items-center justify-between flex-shrink-0 z-10">
        {/* Task pills */}
        <div className="flex items-center gap-3">
          {exam.tasks.map((task, idx) => {
            const isActive = idx === activeTaskIndex;
            const wc = wordCounts[idx];
            const written = wc > 0;
            const meetsMin = wc >= task.minWords;

            return (
              <button
                key={task.taskNumber}
                onClick={() => onTaskChange(idx)}
                className={`flex items-center gap-2 px-4 h-9 rounded-lg border-2 text-sm font-semibold transition-all ${
                  isActive
                    ? 'border-primary bg-white text-primary shadow-sm'
                    : written && meetsMin
                    ? 'border-success bg-success/10 text-success'
                    : written
                    ? 'border-amber-400 bg-amber-50 text-amber-600'
                    : 'border-gray-200 bg-exam-bg text-gray-400 hover:border-gray-300'
                }`}
              >
                Task {task.taskNumber}
                {written && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    meetsMin ? 'bg-success text-white' : 'bg-amber-400 text-white'
                  }`}>
                    {wc}w
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <button
              onClick={() => canGoPrev && onTaskChange(activeTaskIndex - 1)}
              disabled={!canGoPrev}
              className="w-10 h-10 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </button>
            <button
              onClick={() => canGoNext && onTaskChange(activeTaskIndex + 1)}
              disabled={!canGoNext}
              className="w-10 h-10 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowForwardIosIcon fontSize="small" />
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

      {confirmOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Submit your writing test?</h2>
            <div className="space-y-3">
              {exam.tasks.map((task, i) => {
                const wc = wordCounts[i];
                const ok = wc >= task.minWords;
                return (
                  <div key={task.taskNumber} className={`flex items-center justify-between text-sm rounded-lg px-3 py-2 ${ok ? 'bg-success/5' : 'bg-red-50'}`}>
                    <span className="text-gray-700 font-medium">Task {task.taskNumber}</span>
                    <span className={`font-semibold ${ok ? 'text-success' : 'text-red-500'}`}>
                      {wc} / {task.minWords} words {!ok && '⚠'}
                    </span>
                  </div>
                );
              })}
            </div>
            {hasWarning && (
              <p className="mt-3 text-xs text-red-500">
                One or more tasks are below the minimum word count.
              </p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 h-11 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Continue Writing
              </button>
              <button
                onClick={() => { setConfirmOpen(false); onSubmit(); }}
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
