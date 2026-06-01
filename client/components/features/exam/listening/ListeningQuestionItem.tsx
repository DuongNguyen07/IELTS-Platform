'use client';

import FlagIcon from '@mui/icons-material/Flag';
import type { ListeningQuestion } from '@/shared/data/exams/listening/types';

interface Props {
  question: ListeningQuestion;
  answer: string | undefined;
  isFlagged: boolean;
  onAnswer: (value: string) => void;
  onToggleFlag: () => void;
  matchingOptions?: { letter: string; text: string }[];
}

export default function ListeningQuestionItem({
  question, answer, isFlagged, onAnswer, onToggleFlag,
}: Props) {
  const isAnswered = Boolean(answer);

  return (
    <div id={`question-${question.number}`} data-question={question.number} className="group">
      <div className="flex gap-4 mb-3">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm transition-colors ${
          isAnswered ? 'bg-success text-white' : 'bg-green-100 text-green-700'
        }`}>
          {question.number}
        </span>

        <div className="flex-1 pt-1">
          <QuestionText question={question} />
        </div>

        <button
          onClick={onToggleFlag}
          title={isFlagged ? 'Remove flag' : 'Flag for review'}
          className="flex-shrink-0 p-1 rounded hover:bg-gray-100 transition-colors mt-0.5"
        >
          <FlagIcon style={{ fontSize: '1rem', color: isFlagged ? '#f59e0b' : '#d1d5db' }} />
        </button>
      </div>

      <div className="pl-12">
        <QuestionInput question={question} answer={answer} onAnswer={onAnswer} />
      </div>
    </div>
  );
}

function QuestionText({ question }: { question: ListeningQuestion }) {
  if (question.type === 'plan-map-diagram') {
    return (
      <p className="text-base text-slate-800">
        Location <span className="font-bold">{question.locationLabel}</span>
      </p>
    );
  }
  if ('text' in question) {
    return <p className="text-base text-slate-800 leading-snug">{question.text}</p>;
  }
  return null;
}

function QuestionInput({ question, answer, onAnswer }: {
  question: ListeningQuestion;
  answer: string | undefined;
  onAnswer: (v: string) => void;
}) {
  // ── Multiple Choice (one) ─────────────────────────────────────────────────
  if (question.type === 'multiple-choice') {
    return (
      <div className="space-y-3">
        {question.options.map((opt) => (
          <label key={opt.letter} className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name={`q${question.number}`}
              value={opt.letter}
              checked={answer === opt.letter}
              onChange={() => onAnswer(opt.letter)}
              className="w-5 h-5 mt-0.5 text-primary border-gray-300 focus:ring-primary flex-shrink-0"
            />
            <span className="text-slate-700 text-sm leading-relaxed">
              <span className="font-semibold mr-1">{opt.letter}.</span>{opt.text}
            </span>
          </label>
        ))}
      </div>
    );
  }

  // ── Multiple Choice (many) ────────────────────────────────────────────────
  if (question.type === 'multiple-choice-many') {
    const selected = new Set((answer ?? '').split(',').filter(Boolean));
    const toggle = (letter: string) => {
      const next = new Set(selected);
      next.has(letter) ? next.delete(letter) : next.add(letter);
      onAnswer([...next].sort().join(','));
    };
    return (
      <div className="space-y-3">
        <p className="text-xs text-gray-400 mb-1">Choose {question.chooseCount} answers</p>
        {question.options.map((opt) => (
          <label key={opt.letter} className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              value={opt.letter}
              checked={selected.has(opt.letter)}
              onChange={() => toggle(opt.letter)}
              className="w-5 h-5 mt-0.5 text-primary border-gray-300 rounded focus:ring-primary flex-shrink-0"
            />
            <span className="text-slate-700 text-sm leading-relaxed">
              <span className="font-semibold mr-1">{opt.letter}.</span>{opt.text}
            </span>
          </label>
        ))}
      </div>
    );
  }

  // ── Plan / Map / Diagram ──────────────────────────────────────────────────
  if (question.type === 'plan-map-diagram') {
    return (
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={answer ?? ''}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Label text"
          className="w-48 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        {question.wordLimit && <span className="text-xs text-gray-400">max {question.wordLimit} words</span>}
      </div>
    );
  }

  // ── Short answer ──────────────────────────────────────────────────────────
  if (question.type === 'short-answer') {
    return (
      <div>
        <input
          type="text"
          value={answer ?? ''}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Type your answer"
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        {question.wordLimit && <p className="text-xs text-gray-400 mt-1">No more than {question.wordLimit} words</p>}
      </div>
    );
  }

  return null;
}
