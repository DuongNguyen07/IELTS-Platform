'use client';

import FlagIcon from '@mui/icons-material/Flag';
import SortDropdown from '@/components/ui/SortDropdown';
import type {
  Question,
  MatchingHeadingsGroup,
  MatchingFeaturesEndingGroup,
  MatchingInformationGroup,
} from '@/shared/data/exams/reading/types';

interface Props {
  question: Question;
  answer: string | undefined;
  isFlagged: boolean;
  onAnswer: (value: string) => void;
  onToggleFlag: () => void;
  headingOptions?: MatchingHeadingsGroup['headingOptions'];
  featuresOptions?: MatchingFeaturesEndingGroup['options'];
  paragraphLabels?: MatchingInformationGroup['paragraphLabels'];
}

export default function QuestionItem({
  question, answer, isFlagged, onAnswer, onToggleFlag,
  headingOptions, featuresOptions, paragraphLabels,
}: Props) {
  const isAnswered = question.type === 'multiple-choice-many'
    ? (answer ?? '').split(',').filter(Boolean).length > 0
    : Boolean(answer);

  const isInline = question.type === 'sentence-completion' || question.type === 'gap-filling';

  return (
    <div
      id={`question-${question.number}`}
      data-question={question.number}
      className="group"
    >
      <div className="flex gap-4 mb-4">
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm transition-colors ${
            isAnswered ? 'bg-success text-white' : 'bg-green-100 text-green-700'
          }`}
        >
          {question.number}
        </span>

        <div className="flex-1 pt-1">
          {isInline ? (
            <QuestionInput
              question={question}
              answer={answer}
              onAnswer={onAnswer}
              headingOptions={headingOptions}
              featuresOptions={featuresOptions}
              paragraphLabels={paragraphLabels}
            />
          ) : (
            <QuestionText question={question} />
          )}
        </div>

        <button
          onClick={onToggleFlag}
          title={isFlagged ? 'Remove flag' : 'Flag for review'}
          className="flex-shrink-0 p-1 rounded hover:bg-gray-100 transition-colors mt-0.5"
        >
          <FlagIcon style={{ fontSize: '1rem', color: isFlagged ? '#f59e0b' : '#d1d5db' }} />
        </button>
      </div>

      {!isInline && (
        <div className="pl-12">
          <QuestionInput
            question={question}
            answer={answer}
            onAnswer={onAnswer}
            headingOptions={headingOptions}
            featuresOptions={featuresOptions}
            paragraphLabels={paragraphLabels}
          />
        </div>
      )}
    </div>
  );
}

function QuestionText({ question }: { question: Question }) {
  if (question.type === 'sentence-completion' || question.type === 'gap-filling') {
    return null; 
  }
  if (question.type === 'matching-headings') {
    return (
      <p className="text-base text-slate-800">
        Paragraph <span className="font-bold">{question.paragraphLabel}</span>
      </p>
    );
  }
  if ('text' in question) {
    return <p className="text-base text-slate-800 leading-snug">{question.text}</p>;
  }
  return null;
}

function QuestionInput({
  question, answer, onAnswer, headingOptions, featuresOptions, paragraphLabels,
}: {
  question: Question;
  answer: string | undefined;
  onAnswer: (v: string) => void;
  headingOptions?: MatchingHeadingsGroup['headingOptions'];
  featuresOptions?: MatchingFeaturesEndingGroup['options'];
  paragraphLabels?: MatchingInformationGroup['paragraphLabels'];
}) {
  // ── True / False / Not Given ──────────────────────────────────────────────
  if (question.type === 'true-false-not-given') {
    return (
      <div className="space-y-3">
        {(['TRUE', 'FALSE', 'NOT GIVEN'] as const).map((opt) => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name={`q${question.number}`} value={opt}
              checked={answer === opt} onChange={() => onAnswer(opt)}
              className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
            />
            <span className="text-slate-700">{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  // ── Yes / No / Not Given ──────────────────────────────────────────────────
  if (question.type === 'yes-no-not-given') {
    return (
      <div className="space-y-3">
        {(['YES', 'NO', 'NOT GIVEN'] as const).map((opt) => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name={`q${question.number}`} value={opt}
              checked={answer === opt} onChange={() => onAnswer(opt)}
              className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
            />
            <span className="text-slate-700">{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  // ── Multiple Choice (one answer) ──────────────────────────────────────────
  if (question.type === 'multiple-choice') {
    return (
      <div className="space-y-3">
        {question.options.map((opt) => (
          <label key={opt.letter} className="flex items-start gap-3 cursor-pointer">
            <input type="radio" name={`q${question.number}`} value={opt.letter}
              checked={answer === opt.letter} onChange={() => onAnswer(opt.letter)}
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

  // ── Multiple Choice (many answers) ───────────────────────────────────────
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
            <input type="checkbox" value={opt.letter}
              checked={selected.has(opt.letter)} onChange={() => toggle(opt.letter)}
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

  // ── Sentence Completion ───────────────────────────────────────────────────
  if (question.type === 'sentence-completion') {
    return (
      <p className="text-slate-800 leading-relaxed flex flex-wrap items-baseline gap-x-1.5 text-base">
        <span>{question.beforeBlank}</span>
        <input type="text" value={answer ?? ''} onChange={(e) => onAnswer(e.target.value)}
          className="inline-block w-36 px-2 py-0.5 border-2 border-gray-200 bg-blue-50/50 text-center text-sm font-medium focus:shadow-primary rounded-lg"
        />
        {question.afterBlank && <span>{question.afterBlank}</span>}
        {question.wordLimit && <span className="text-xs text-gray-400"></span>}
      </p>
    );
  }

  // ── Gap Filling ───────────────────────────────────────────────────────────
  if (question.type === 'gap-filling') {
    return (
      <p className="text-slate-800 leading-relaxed flex flex-wrap items-baseline gap-x-1.5 text-sm">
        {question.beforeBlank && <span>{question.beforeBlank}</span>}
        <input type="text" value={answer ?? ''} onChange={(e) => onAnswer(e.target.value)}
          className="inline-block w-36 px-2 py-0.5 border-b-2 border-primary bg-blue-50/50 text-center text-sm font-medium focus:shadow-primary rounded-sm"
        />
        {question.afterBlank && <span>{question.afterBlank}</span>}
        {question.wordLimit && <span className="text-xs text-gray-400">(max {question.wordLimit} words)</span>}
      </p>
    );
  }

  // ── Short Answer ──────────────────────────────────────────────────────────
  if (question.type === 'short-answer') {
    return (
      <div>
        <input type="text" value={answer ?? ''} onChange={(e) => onAnswer(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm  focus:shadow-primary"
        />
      </div>
    );
  }

  // ── Matching Headings ─────────────────────────────────────────────────────
  if (question.type === 'matching-headings') {
    const options = [
      { value: '', label: 'Select a heading' },
      ...(headingOptions ?? []).map((h) => ({ value: h.label, label: `${h.label}. ${h.text}` })),
    ];
    return <SortDropdown options={options} value={answer ?? ''} onChange={onAnswer} />;
  }

  // ── Matching Features / Sentence Endings ──────────────────────────────────
  if (question.type === 'matching-features-ending') {
    const options = [
      { value: '', label: 'Select an option' },
      ...(featuresOptions ?? []).map((opt) => ({ value: opt.letter, label: `${opt.letter}. ${opt.text}` })),
    ];
    return <SortDropdown options={options} value={answer ?? ''} onChange={onAnswer} />;
  }

  // ── Matching Information ──────────────────────────────────────────────────
  if (question.type === 'matching-information') {
    const options = [
      { value: '', label: 'Select a paragraph' },
      ...(paragraphLabels ?? []).map((label) => ({ value: label, label: `Paragraph ${label}` })),
    ];
    return <SortDropdown options={options} value={answer ?? ''} onChange={onAnswer} />;
  }

  // ── Diagram Label Completion ──────────────────────────────────────────────
  if (question.type === 'diagram-label-completion') {
    return (
      <input type="text" value={answer ?? ''} onChange={(e) => onAnswer(e.target.value)}
        placeholder="Label text"
        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
    );
  }

  // ── Other ─────────────────────────────────────────────────────────────────
  if (question.type === 'other') {
    return (
      <input type="text" value={answer ?? ''} onChange={(e) => onAnswer(e.target.value)}
        placeholder="Type your answer"
        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
    );
  }

  return null;
}
