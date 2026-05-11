'use client';

import { forwardRef } from 'react';
import type {
  ReadingPart,
  MatchingHeadingsGroup,
  MatchingFeaturesEndingGroup,
  DiagramLabelCompletionGroup,
} from '@/shared/data/exams/reading/types';
import QuestionItem from './QuestionItem';

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
      <div ref={ref} className="w-[45%] flex-shrink-0 bg-gray-50 overflow-y-auto">
        <div className="max-w-xl mx-auto px-6 py-8 space-y-10">
          {/* Part header */}
          <div className="flex items-baseline gap-2 pb-2 border-b border-gray-200">
            <h2 className="font-bold text-base text-navy">Part {part.partNumber}</h2>
            <span className="text-sm text-gray-500">
              Questions {part.questionRange.from}–{part.questionRange.to}
            </span>
          </div>

          {part.questionGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-4">
              {/* Question range + instruction */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                  Questions {group.questionRange.from}–{group.questionRange.to}
                </p>
                <p className="text-sm text-blue-800">{group.instruction}</p>

                {/* Matching headings — options shown once at group level */}
                {group.type === 'matching-headings' && (
                  <div className="mt-3 pt-3 border-t border-blue-200 space-y-1">
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
                      List of Headings
                    </p>
                    {(group as MatchingHeadingsGroup).headingOptions.map((h) => (
                      <p key={h.label} className="text-sm text-blue-900">
                        <span className="font-bold">{h.label}.</span> {h.text}
                      </p>
                    ))}
                  </div>
                )}

                {/* Matching features/endings — options shown once at group level */}
                {group.type === 'matching-features-ending' && (
                  <div className="mt-3 pt-3 border-t border-blue-200 space-y-1">
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
                      List of Options
                    </p>
                    {(group as MatchingFeaturesEndingGroup).options.map((opt) => (
                      <p key={opt.letter} className="text-sm text-blue-900">
                        <span className="font-bold">{opt.letter}.</span> {opt.text}
                      </p>
                    ))}
                  </div>
                )}

                {/* Diagram label — show diagram context once at group level */}
                {group.type === 'diagram-label-completion' && (group as DiagramLabelCompletionGroup).diagramDescription && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Diagram</p>
                    <p className="text-sm text-blue-900 italic">{(group as DiagramLabelCompletionGroup).diagramDescription}</p>
                  </div>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-3">
                {group.questions.map((question) => (
                  <QuestionItem
                    key={question.number}
                    question={question}
                    answer={answers[question.number]}
                    isFlagged={flagged.has(question.number)}
                    onAnswer={(value) => onAnswer(question.number, value)}
                    onToggleFlag={() => onToggleFlag(question.number)}
                    headingOptions={
                      group.type === 'matching-headings'
                        ? (group as MatchingHeadingsGroup).headingOptions
                        : undefined
                    }
                    featuresOptions={
                      group.type === 'matching-features-ending'
                        ? (group as MatchingFeaturesEndingGroup).options
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ReadingQuestions.displayName = 'ReadingQuestions';
export default ReadingQuestions;
