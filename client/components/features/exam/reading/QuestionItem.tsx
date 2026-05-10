'use client';

import FlagIcon from '@mui/icons-material/Flag';
import type {
  Question,
  MatchingHeadingsGroup,
  MatchingFeaturesEndingGroup,
} from '@/shared/data/exams/reading/types';

interface Props {
  question: Question;
  answer: string | undefined;
  isFlagged: boolean;
  onAnswer: (value: string) => void;
  onToggleFlag: () => void;
  /** Required for matching-headings questions */
  headingOptions?: MatchingHeadingsGroup['headingOptions'];
  /** Required for matching-features-ending questions */
  featuresOptions?: MatchingFeaturesEndingGroup['options'];
}

export default function QuestionItem({ question, answer, isFlagged, onAnswer, onToggleFlag, headingOptions, featuresOptions }: Props) {
  const isAnswered = Boolean(answer);

  const borderColor = isFlagged
    ? 'border-amber-400'
    : isAnswered
    ? 'border-primary'
    : 'border-gray-200';

  return (
    <div
      id={`question-${question.number}`}
      data-question={question.number}
      className={`bg-white rounded-lg border-l-4 ${borderColor} border border-gray-100 p-4 shadow-sm`}
    >
      {/* Question header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              isAnswered ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {question.number}
          </span>
          {question.type === 'sentence-completion' || question.type === 'short-answer' || question.type === 'diagram-label-completion' ? null : (
            <QuestionText question={question} />
          )}
        </div>
        <button
          onClick={onToggleFlag}
          title={isFlagged ? 'Remove flag' : 'Flag for review'}
          className="flex-shrink-0 p-1 rounded hover:bg-gray-100 transition-colors"
        >
          <FlagIcon style={{ fontSize: '1rem', color: isFlagged ? '#f59e0b' : '#d1d5db' }} />
        </button>
      </div>

      {/* Answer input — varies by question type */}
      <QuestionInput
        question={question}
        answer={answer}
        onAnswer={onAnswer}
        headingOptions={headingOptions}
        featuresOptions={featuresOptions}
      />
    </div>
  );
}

// ── Question text (for multi-line question text displayed above inputs) ────────
function QuestionText({ question }: { question: Question }) {
  if (question.type === 'true-false-not-given' || question.type === 'yes-no-not-given') {
    return <p className="text-sm text-gray-800 leading-relaxed">{question.text}</p>;
  }
  if (question.type === 'multiple-choice') {
    return <p className="text-sm text-gray-800 leading-relaxed">{question.text}</p>;
  }
  if (question.type === 'matching-headings') {
    return (
      <p className="text-sm text-gray-700">
        Paragraph <span className="font-bold text-navy">{question.paragraphLabel}</span>
      </p>
    );
  }
  if (question.type === 'matching-features-ending') {
    return <p className="text-sm text-gray-800 leading-relaxed">{question.text}</p>;
  }
  return null;
}

function QuestionInput({
  question,
  answer,
  onAnswer,
  headingOptions,
  featuresOptions,
}: {
  question: Question;
  answer: string | undefined;
  onAnswer: (v: string) => void;
  headingOptions?: MatchingHeadingsGroup['headingOptions'];
  featuresOptions?: MatchingFeaturesEndingGroup['options'];
}) {
  // ── True / False / Not Given ──────────────────────────────────────────────
  if (question.type === 'true-false-not-given') {
    const opts = ['TRUE', 'FALSE', 'NOT GIVEN'] as const;
    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {opts.map((opt) => (
          <RadioPill key={opt} label={opt} selected={answer === opt} onClick={() => onAnswer(opt)} />
        ))}
      </div>
    );
  }

  // ── Yes / No / Not Given ──────────────────────────────────────────────────
  if (question.type === 'yes-no-not-given') {
    const opts = ['YES', 'NO', 'NOT GIVEN'] as const;
    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {opts.map((opt) => (
          <RadioPill key={opt} label={opt} selected={answer === opt} onClick={() => onAnswer(opt)} />
        ))}
      </div>
    );
  }

  // ── Multiple Choice ───────────────────────────────────────────────────────
  if (question.type === 'multiple-choice') {
    return (
      <div className="space-y-2 mt-2">
        {question.options.map((opt) => {
          const selected = answer === opt.letter;
          return (
            <button
              key={opt.letter}
              onClick={() => onAnswer(opt.letter)}
              className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                selected
                  ? 'border-primary bg-blue-50 text-primary font-medium'
                  : 'border-gray-200 text-gray-700 hover:border-primary/40 hover:bg-gray-50'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                  selected ? 'border-primary bg-primary text-white' : 'border-gray-300 text-gray-500'
                }`}
              >
                {opt.letter}
              </span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // ── Sentence Completion ───────────────────────────────────────────────────
  if (question.type === 'sentence-completion') {
    return (
      <p className="text-sm text-gray-800 leading-relaxed flex flex-wrap items-baseline gap-x-1 mt-1">
        <span>{question.beforeBlank}</span>
        <input
          type="text"
          value={answer ?? ''}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="your answer"
          className="inline-block w-36 px-2 py-0.5 border-b-2 border-primary bg-blue-50/50 text-center text-sm font-medium focus:outline-none focus:border-primary rounded-sm"
        />
        {question.afterBlank && <span>{question.afterBlank}</span>}
      </p>
    );
  }

  // ── Short Answer ──────────────────────────────────────────────────────────
  if (question.type === 'short-answer') {
    return (
      <div className="mt-1">
        <p className="text-sm text-gray-800 leading-relaxed mb-2">{question.text}</p>
        <input
          type="text"
          value={answer ?? ''}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Type your answer"
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        {question.wordLimit && (
          <p className="text-xs text-gray-400 mt-1">No more than {question.wordLimit} words</p>
        )}
      </div>
    );
  }

  // ── Matching Headings ─────────────────────────────────────────────────────
  if (question.type === 'matching-headings') {
    return (
      <div className="mt-2">
        <select
          value={answer ?? ''}
          onChange={(e) => onAnswer(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-700"
        >
          <option value="">— Select a heading —</option>
          {headingOptions?.map((h) => (
            <option key={h.label} value={h.label}>
              {h.label}. {h.text}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // ── Matching Features / Sentence Endings ──────────────────────────────────
  if (question.type === 'matching-features-ending') {
    return (
      <div className="mt-2">
        <select
          value={answer ?? ''}
          onChange={(e) => onAnswer(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-700"
        >
          <option value="">— Select an option —</option>
          {featuresOptions?.map((opt) => (
            <option key={opt.letter} value={opt.letter}>
              {opt.letter}. {opt.text}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // ── Diagram Label Completion ──────────────────────────────────────────────
  if (question.type === 'diagram-label-completion') {
    return (
      <div className="mt-1">
        <p className="text-sm text-gray-800 leading-relaxed mb-2">{question.text}</p>
        <input
          type="text"
          value={answer ?? ''}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Label text"
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>
    );
  }

  return null;
}

// ── Reusable pill radio button ────────────────────────────────────────────────
function RadioPill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
        selected
          ? 'bg-primary border-primary text-white'
          : 'border-gray-300 text-gray-600 hover:border-primary/50 hover:bg-blue-50'
      }`}
    >
      {label}
    </button>
  );
}
