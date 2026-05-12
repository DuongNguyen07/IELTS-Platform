'use client';

import { forwardRef } from 'react';
import type {
  ReadingPart,
  QuestionGroup,
} from '@/shared/data/exams/reading/types';
import QuestionItem from './QuestionItem';

function GroupMeta({ group }: { group: QuestionGroup }) {
  if (group.type === 'matching-headings') {
    return (
      <div className="mt-3 pt-3 border-t border-slate-200 space-y-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">List of Headings</p>
        {group.headingOptions.map((h) => (
          <p key={h.label} className="text-sm text-slate-700">
            <span className="font-bold">{h.label}.</span> {h.text}
          </p>
        ))}
      </div>
    );
  }
  if (group.type === 'matching-features-ending') {
    return (
      <div className="mt-3 pt-3 border-t border-slate-200 space-y-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">List of Options</p>
        {group.options.map((opt) => (
          <p key={opt.letter} className="text-sm text-slate-700">
            <span className="font-bold">{opt.letter}.</span> {opt.text}
          </p>
        ))}
      </div>
    );
  }
  if (group.type === 'matching-information') {
    return (
      <div className="mt-3 pt-3 border-t border-slate-200">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Paragraphs</p>
        <p className="text-sm text-slate-600">{group.paragraphLabels.join(', ')}</p>
      </div>
    );
  }
  if (group.type === 'diagram-label-completion' && group.diagramDescription) {
    return (
      <div className="mt-3 pt-3 border-t border-slate-200">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Diagram</p>
        <p className="text-sm text-slate-700 italic">{group.diagramDescription}</p>
      </div>
    );
  }
  if (group.type === 'gap-filling' && group.contextText) {
    return (
      <div className="mt-3 pt-3 border-t border-slate-200">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Context</p>
        <p className="text-sm text-slate-700 leading-relaxed">{group.contextText}</p>
      </div>
    );
  }
  return null;
}

function getGroupOptions(group: QuestionGroup) {
  if (group.type === 'matching-headings') {
    return { headingOptions: group.headingOptions, featuresOptions: undefined, paragraphLabels: undefined } as const;
  }
  if (group.type === 'matching-features-ending') {
    return { headingOptions: undefined, featuresOptions: group.options, paragraphLabels: undefined } as const;
  }
  if (group.type === 'matching-information') {
    return { headingOptions: undefined, featuresOptions: undefined, paragraphLabels: group.paragraphLabels } as const;
  }
  return { headingOptions: undefined, featuresOptions: undefined, paragraphLabels: undefined } as const;
}

interface Props {
  part: ReadingPart;
  answers: Record<number, string>;
  flagged: Set<number>;
  onAnswer: (questionNumber: number, value: string) => void;
  onToggleFlag: (questionNumber: number) => void;
}

const ReadingQuestions = forwardRef<HTMLDivElement, Props>(
  ({ part, answers, flagged, onAnswer, onToggleFlag }, ref) => {
    return (
      <div ref={ref} className="flex-1 overflow-y-auto bg-white min-w-0" style={{ scrollbarWidth: 'thin' }}>
        <div className="max-w-2xl mx-auto px-10 py-8 space-y-10">

          {part.questionGroups.map((group, _groupIdx) => {
            const { headingOptions, featuresOptions, paragraphLabels } = getGroupOptions(group);
            return (
              <div key={group.questionRange.from} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">
                    Questions {group.questionRange.from}
                    {group.questionRange.from !== group.questionRange.to && ` - ${group.questionRange.to}`}
                  </h2>
                  <div className="bg-slate-50 border-l-4 border-slate-300 p-4 mb-6 text-sm text-slate-600 space-y-1">
                    <p>{group.instruction}</p>
                    <GroupMeta group={group} />
                  </div>
                </div>

                <div className="space-y-8">
                  {group.questions.map((question) => (
                    <QuestionItem
                      key={question.number}
                      question={question}
                      answer={answers[question.number]}
                      isFlagged={flagged.has(question.number)}
                      onAnswer={(value) => onAnswer(question.number, value)}
                      onToggleFlag={() => onToggleFlag(question.number)}
                      headingOptions={headingOptions}
                      featuresOptions={featuresOptions}
                      paragraphLabels={paragraphLabels}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

ReadingQuestions.displayName = 'ReadingQuestions';
export default ReadingQuestions;
