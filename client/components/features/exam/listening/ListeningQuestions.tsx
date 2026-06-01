'use client';

import { useState, forwardRef } from 'react';
import FlagIcon from '@mui/icons-material/Flag';
import type {
  ListeningSection,
  ListeningQuestionGroup,
  FormCompletionQuestion,
  NoteCompletionQuestion,
  TableCompletionQuestion,
  SummaryCompletionQuestion,
  FlowChartCompletionQuestion,
  SentenceCompletionQuestion,
  MatchingQuestion,
} from '@/shared/data/exams/listening/types';
import ListeningQuestionItem from './ListeningQuestionItem';

// ── Shared primitives ─────────────────────────────────────────────────────────

function QuestionBadge({ number, answered }: { number: number; answered: boolean }) {
  return (
    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
      answered ? 'bg-success text-white' : 'bg-green-100 text-green-700'
    }`}>
      {number}
    </span>
  );
}

function FlagBtn({ flagged, onToggle }: { flagged: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="p-1 rounded hover:bg-gray-100 flex-shrink-0"
      title={flagged ? 'Remove flag' : 'Flag for review'}
    >
      <FlagIcon style={{ fontSize: '1rem', color: flagged ? '#f59e0b' : '#d1d5db' }} />
    </button>
  );
}

function BlankInput({ value, onChange, wordLimit, className = 'w-36' }: {
  value: string; onChange: (v: string) => void; wordLimit?: number; className?: string;
}) {
  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`inline-block ${className} px-2 py-0.5 border-2 border-gray-200 bg-blue-50/60 text-center text-sm font-medium rounded-lg focus:outline-none focus:border-primary transition-colors`}
      />
      {wordLimit && <span className="text-xs text-gray-400 ml-0.5">(max {wordLimit}w)</span>}
    </>
  );
}

function GroupHeader({ group }: { group: ListeningQuestionGroup }) {
  const { from, to } = group.questionRange;
  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold text-slate-800 mb-3">
        Questions {from}{from !== to && `–${to}`}
      </h2>
      <div className="bg-slate-50 border-l-4 border-primary/40 p-4 text-sm text-slate-600 rounded-r-lg leading-relaxed">
        {group.instruction}
      </div>
    </div>
  );
}

// ── Form completion → card table ──────────────────────────────────────────────

function FormCompletionGroup({ group, answers, flagged, onAnswer, onToggleFlag }: {
  group: Extract<ListeningQuestionGroup, { type: 'form-completion' }>;
  answers: Record<number, string>; flagged: Set<number>;
  onAnswer: (n: number, v: string) => void; onToggleFlag: (n: number) => void;
}) {
  return (
    <div>
      <GroupHeader group={group} />
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {group.formTitle && (
          <div className="bg-slate-700 text-white px-5 py-3">
            <p className="font-semibold text-sm tracking-wide">{group.formTitle}</p>
          </div>
        )}
        <table className="w-full">
          <tbody className="divide-y divide-gray-100">
            {(group.questions as FormCompletionQuestion[]).map((q) => (
              <tr key={q.number} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 w-10">
                  <QuestionBadge number={q.number} answered={Boolean(answers[q.number])} />
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700 w-2/5">{q.fieldLabel}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={answers[q.number] ?? ''}
                      onChange={(e) => onAnswer(q.number, e.target.value)}
                      className="w-52 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                    {q.wordLimit && <span className="text-xs text-gray-400">max {q.wordLimit}w</span>}
                  </div>
                </td>
                <td className="px-3 py-3 w-10">
                  <FlagBtn flagged={flagged.has(q.number)} onToggle={() => onToggleFlag(q.number)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Note completion → notes block ─────────────────────────────────────────────

function NoteCompletionGroup({ group, answers, flagged, onAnswer, onToggleFlag }: {
  group: Extract<ListeningQuestionGroup, { type: 'note-completion' }>;
  answers: Record<number, string>; flagged: Set<number>;
  onAnswer: (n: number, v: string) => void; onToggleFlag: (n: number) => void;
}) {
  return (
    <div>
      <GroupHeader group={group} />
      <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden shadow-sm">
        {group.notesTitle && (
          <div className="bg-amber-100 border-b border-amber-200 px-5 py-3">
            <p className="font-bold text-slate-800 text-sm uppercase tracking-wider">{group.notesTitle}</p>
          </div>
        )}
        <div className="px-5 py-4 space-y-4">
          {(group.questions as NoteCompletionQuestion[]).map((q) => (
            <div key={q.number} className="flex items-baseline gap-3">
              <QuestionBadge number={q.number} answered={Boolean(answers[q.number])} />
              <p className="text-sm text-slate-800 leading-relaxed flex flex-wrap items-baseline gap-x-1.5 flex-1">
                {q.beforeBlank && <span>{q.beforeBlank}</span>}
                <BlankInput value={answers[q.number] ?? ''} onChange={(v) => onAnswer(q.number, v)} wordLimit={q.wordLimit} />
                {q.afterBlank && <span>{q.afterBlank}</span>}
              </p>
              <FlagBtn flagged={flagged.has(q.number)} onToggle={() => onToggleFlag(q.number)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Table completion → HTML table ─────────────────────────────────────────────

function TableCompletionGroup({ group, answers, flagged, onAnswer, onToggleFlag }: {
  group: Extract<ListeningQuestionGroup, { type: 'table-completion' }>;
  answers: Record<number, string>; flagged: Set<number>;
  onAnswer: (n: number, v: string) => void; onToggleFlag: (n: number) => void;
}) {
  const questions = group.questions as TableCompletionQuestion[];
  const headers = group.columnHeaders ?? [];

  const rowMap = new Map<string, TableCompletionQuestion[]>();
  for (const q of questions) {
    const key = q.rowLabel ?? `q${q.number}`;
    if (!rowMap.has(key)) rowMap.set(key, []);
    rowMap.get(key)!.push(q);
  }

  return (
    <div>
      <GroupHeader group={group} />
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {group.tableTitle && (
          <div className="bg-slate-700 text-white px-5 py-3">
            <p className="font-semibold text-sm tracking-wide">{group.tableTitle}</p>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {headers.length > 0 && (
              <thead>
                <tr className="bg-slate-100 border-b border-gray-200">
                  {headers.map((h, i) => (
                    <th key={i} className="px-4 py-2.5 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                  <th className="w-8" />
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-gray-100">
              {[...rowMap.entries()].map(([rowKey, rowQs]) => (
                <tr key={rowKey} className="hover:bg-gray-50/50 transition-colors">
                  {headers.map((col, colIdx) => {
                    const q = rowQs.find((q) => q.columnLabel === col);
                    if (colIdx === 0 && !q) {
                      return (
                        <td key={col} className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                          {rowKey}
                        </td>
                      );
                    }
                    return (
                      <td key={col} className="px-4 py-3">
                        {q ? (
                          <span className="flex items-baseline gap-2 flex-wrap">
                            <QuestionBadge number={q.number} answered={Boolean(answers[q.number])} />
                            {q.beforeBlank && <span className="text-slate-700">{q.beforeBlank}</span>}
                            <BlankInput value={answers[q.number] ?? ''} onChange={(v) => onAnswer(q.number, v)} wordLimit={q.wordLimit} />
                            {q.afterBlank && <span className="text-slate-700">{q.afterBlank}</span>}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-3 py-3 w-10">
                    {rowQs.map((q) => (
                      <FlagBtn key={q.number} flagged={flagged.has(q.number)} onToggle={() => onToggleFlag(q.number)} />
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Summary / Flow-chart completion → inline paragraph ────────────────────────

function SummaryFlowGroup({ group, answers, flagged, onAnswer, onToggleFlag }: {
  group: Extract<ListeningQuestionGroup, { type: 'summary-completion' | 'flow-chart-completion' }>;
  answers: Record<number, string>; flagged: Set<number>;
  onAnswer: (n: number, v: string) => void; onToggleFlag: (n: number) => void;
}) {
  const title =
    group.type === 'summary-completion'
      ? (group as Extract<typeof group, { type: 'summary-completion' }>).summaryTitle
      : (group as Extract<typeof group, { type: 'flow-chart-completion' }>).chartTitle;
  const questions = group.questions as (SummaryCompletionQuestion | FlowChartCompletionQuestion)[];

  return (
    <div>
      <GroupHeader group={group} />
      <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {title && (
          <div className="bg-slate-200 border-b border-slate-300 px-5 py-3">
            <p className="font-bold text-slate-800 text-sm">{title}</p>
          </div>
        )}
        <div className="px-5 py-5 space-y-4">
          {questions.map((q) => (
            <div key={q.number} className="flex items-baseline gap-3">
              <QuestionBadge number={q.number} answered={Boolean(answers[q.number])} />
              <p className="text-sm text-slate-800 leading-relaxed flex flex-wrap items-baseline gap-x-1.5 flex-1">
                {q.beforeBlank && <span>{q.beforeBlank}</span>}
                <BlankInput value={answers[q.number] ?? ''} onChange={(v) => onAnswer(q.number, v)} wordLimit={q.wordLimit} />
                {q.afterBlank && <span>{q.afterBlank}</span>}
              </p>
              <FlagBtn flagged={flagged.has(q.number)} onToggle={() => onToggleFlag(q.number)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Sentence completion → inline blanks ───────────────────────────────────────

function SentenceCompletionGroup({ group, answers, flagged, onAnswer, onToggleFlag }: {
  group: Extract<ListeningQuestionGroup, { type: 'sentence-completion' }>;
  answers: Record<number, string>; flagged: Set<number>;
  onAnswer: (n: number, v: string) => void; onToggleFlag: (n: number) => void;
}) {
  const questions = group.questions;
  return (
    <div>
      <GroupHeader group={group} />
      <div className="space-y-5">
        {questions.map((q) => (
          <div key={q.number} data-question={q.number} className="flex items-baseline gap-3">
            <QuestionBadge number={q.number} answered={Boolean(answers[q.number])} />
            <p className="text-sm text-slate-800 leading-relaxed flex flex-wrap items-baseline gap-x-1.5 flex-1">
              {q.beforeBlank && <span>{q.beforeBlank}</span>}
              <BlankInput value={answers[q.number] ?? ''} onChange={(v) => onAnswer(q.number, v)} wordLimit={q.wordLimit} />
              {q.afterBlank && <span>{q.afterBlank}</span>}
            </p>
            <FlagBtn flagged={flagged.has(q.number)} onToggle={() => onToggleFlag(q.number)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Matching → drag-and-drop ──────────────────────────────────────────────────

function MatchingGroup({ group, answers, flagged, onAnswer, onToggleFlag }: {
  group: Extract<ListeningQuestionGroup, { type: 'matching' }>;
  answers: Record<number, string>; flagged: Set<number>;
  onAnswer: (n: number, v: string) => void; onToggleFlag: (n: number) => void;
}) {
  const [dragging, setDragging] = useState<string | null>(null);
  const questions = group.questions as MatchingQuestion[];

  const usedLetters = new Set(questions.map((q) => answers[q.number]).filter(Boolean));

  const dropOnQuestion = (questionNumber: number) => {
    if (!dragging) return;
    for (const q of questions) {
      if (answers[q.number] === dragging && q.number !== questionNumber) {
        onAnswer(q.number, '');
      }
    }
    onAnswer(questionNumber, dragging);
    setDragging(null);
  };

  const dropOnBank = () => {
    if (!dragging) return;
    for (const q of questions) {
      if (answers[q.number] === dragging) onAnswer(q.number, '');
    }
    setDragging(null);
  };

  return (
    <div>
      <GroupHeader group={group} />

      {/* Options bank */}
      <div
        className="mb-6 p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl"
        onDragOver={(e) => e.preventDefault()}
        onDrop={dropOnBank}
      >
        <p className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-3">Options — drag to match</p>
        <div className="flex flex-wrap gap-2">
          {group.options.map((opt) => {
            const isUsed = usedLetters.has(opt.letter);
            return (
              <div
                key={opt.letter}
                draggable
                onDragStart={() => setDragging(opt.letter)}
                onDragEnd={() => setDragging(null)}
                className={`px-3 py-1.5 rounded-lg text-sm border select-none transition-all ${
                  isUsed
                    ? 'opacity-30 bg-gray-100 border-gray-300 text-gray-500 cursor-default'
                    : 'bg-white border-blue-300 text-slate-700 cursor-grab active:cursor-grabbing hover:border-blue-500 hover:shadow-sm'
                } ${dragging === opt.letter ? 'ring-2 ring-blue-400 opacity-60' : ''}`}
              >
                <span className="font-bold mr-1">{opt.letter}.</span>{opt.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* Questions with drop zones */}
      <div className="space-y-4">
        {questions.map((q) => {
          const assignedLetter = answers[q.number];
          const assignedOption = assignedLetter ? group.options.find((o) => o.letter === assignedLetter) : null;
          return (
            <div key={q.number} data-question={q.number} className="flex items-start gap-3">
              <QuestionBadge number={q.number} answered={Boolean(assignedLetter)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 mb-2 leading-snug">{q.text}</p>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => dropOnQuestion(q.number)}
                  className={`min-h-10 px-3 py-2 rounded-lg border-2 border-dashed flex items-center transition-colors ${
                    assignedOption
                      ? 'border-success/40 bg-success/5'
                      : dragging
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  {assignedOption ? (
                    <div
                      draggable
                      onDragStart={() => setDragging(assignedLetter)}
                      onDragEnd={() => setDragging(null)}
                      className="px-2.5 py-1 rounded-md bg-success/10 text-success text-sm font-medium cursor-grab active:cursor-grabbing border border-success/30"
                    >
                      <span className="font-bold mr-1">{assignedOption.letter}.</span>{assignedOption.text}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm italic">Drop an option here</span>
                  )}
                </div>
              </div>
              <FlagBtn flagged={flagged.has(q.number)} onToggle={() => onToggleFlag(q.number)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Standard group (MC, short-answer, plan-map-diagram) ───────────────────────

function StandardGroup({ group, answers, flagged, onAnswer, onToggleFlag }: {
  group: ListeningQuestionGroup;
  answers: Record<number, string>; flagged: Set<number>;
  onAnswer: (n: number, v: string) => void; onToggleFlag: (n: number) => void;
}) {
  const matchingOptions = group.type === 'matching'
    ? (group as Extract<ListeningQuestionGroup, { type: 'matching' }>).options
    : undefined;
  return (
    <div>
      <GroupHeader group={group} />
      <div className="space-y-8">
        {group.questions.map((question) => (
          <ListeningQuestionItem
            key={question.number}
            question={question}
            answer={answers[question.number]}
            isFlagged={flagged.has(question.number)}
            onAnswer={(value) => onAnswer(question.number, value)}
            onToggleFlag={() => onToggleFlag(question.number)}
            matchingOptions={matchingOptions}
          />
        ))}
      </div>
    </div>
  );
}

// ── Dispatcher ────────────────────────────────────────────────────────────────

function GroupRenderer({ group, answers, flagged, onAnswer, onToggleFlag }: {
  group: ListeningQuestionGroup;
  answers: Record<number, string>; flagged: Set<number>;
  onAnswer: (n: number, v: string) => void; onToggleFlag: (n: number) => void;
}) {
  const p = { answers, flagged, onAnswer, onToggleFlag };
  switch (group.type) {
    case 'form-completion':     return <FormCompletionGroup group={group} {...p} />;
    case 'note-completion':     return <NoteCompletionGroup group={group} {...p} />;
    case 'table-completion':    return <TableCompletionGroup group={group} {...p} />;
    case 'summary-completion':
    case 'flow-chart-completion': return <SummaryFlowGroup group={group} {...p} />;
    case 'matching':            return <MatchingGroup group={group} {...p} />;
    case 'sentence-completion': return <SentenceCompletionGroup group={group} {...p} />;
    default:                    return <StandardGroup group={group} {...p} />;
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

interface Props {
  section: ListeningSection;
  answers: Record<number, string>;
  flagged: Set<number>;
  onAnswer: (questionNumber: number, value: string) => void;
  onToggleFlag: (questionNumber: number) => void;
}

const ListeningQuestions = forwardRef<HTMLDivElement, Props>(
  ({ section, answers, flagged, onAnswer, onToggleFlag }, ref) => {
    return (
      <div ref={ref} className="flex-1 overflow-y-auto bg-white min-w-0 custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>
        <div className="px-10 py-8 pb-36 space-y-12">
          <div className="pb-2 border-b border-gray-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Section {section.sectionNumber}
            </p>
          </div>
          {section.questionGroups.map((group) => (
            <GroupRenderer
              key={group.questionRange.from}
              group={group}
              answers={answers}
              flagged={flagged}
              onAnswer={onAnswer}
              onToggleFlag={onToggleFlag}
            />
          ))}
        </div>
      </div>
    );
  }
);

ListeningQuestions.displayName = 'ListeningQuestions';
export default ListeningQuestions;
