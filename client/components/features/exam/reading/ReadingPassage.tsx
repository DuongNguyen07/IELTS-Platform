'use client';

import type { ReadingPassage as PassageData } from '@/shared/data/exams/reading/types';

interface Props {
  passage: PassageData;
  partNumber: number;
}

export default function ReadingPassage({ passage, partNumber }: Props) {
  return (
    <div className="flex-1 bg-white overflow-y-auto border-r border-gray-200 min-w-0">
      <div className="max-w-2xl mx-auto px-8 py-8">
        {/* Part label */}
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
          Reading Passage {partNumber}
        </p>

        {/* Passage title */}
        <h2 className="text-xl font-bold text-navy mb-1">{passage.title}</h2>

        {passage.subtitle && (
          <p className="text-sm text-gray-500 italic mb-6">{passage.subtitle}</p>
        )}

        {/* Paragraphs */}
        <div className="space-y-4 mt-6">
          {passage.paragraphs.map((para, idx) => (
            <div key={idx} className="flex gap-3">
              {para.label && (
                <span className="font-bold text-gray-600 text-sm w-5 flex-shrink-0 pt-0.5">
                  {para.label}
                </span>
              )}
              <div className="flex-1">
                {para.heading && (
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{para.heading}</h3>
                )}
                <p className="text-sm text-gray-800 leading-[1.8]">{para.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
