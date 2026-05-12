'use client';

import type { ReadingPassage as PassageData } from '@/shared/data/exams/reading/types';

interface Props {
  passage: PassageData;
  partNumber: number;
  style?: React.CSSProperties;
}

export default function ReadingPassage({ passage, partNumber, style }: Props) {
  return (
    <div
      className="overflow-y-auto bg-exam-bg border-r border-gray-200 min-w-0"
      style={{ ...style, scrollbarWidth: 'thin' }}
    >
      <div className="max-w-3xl mx-auto px-12 py-8">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Reading passage {partNumber}</h2>
        <p className="text-slate-500 mb-8 italic text-sm">
          You should spend about 20 minutes on Questions {passage.title && `based on Reading Passage ${partNumber}`} below.
        </p>

        <h3 className="text-2xl font-extrabold text-center mb-10 tracking-tight text-slate-900">
          {passage.title}
        </h3>

        {passage.subtitle && (
          <p className="text-sm text-slate-500 italic text-center mb-8">{passage.subtitle}</p>
        )}

        <div className="space-y-5 leading-relaxed text-[1.05rem] text-slate-800">
          {passage.paragraphs.map((para, idx) => (
            <div key={idx} className="flex gap-3">
              {para.label && (
                <span className="font-bold text-slate-500 text-sm w-5 flex-shrink-0 pt-1">
                  {para.label}
                </span>
              )}
              <div className="flex-1">
                {para.heading && (
                  <h4 className="font-semibold text-slate-900 mb-1">{para.heading}</h4>
                )}
                <p>{para.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
