'use client';

import { useState } from 'react';

interface QuestionDraft {
  text: string;
  bulletPoints: string[];
  timeLimitSecs: number;
  prepTimeSecs?: number;
}

interface PartDraft {
  partNumber: 1 | 2 | 3;
  title: string;
  description: string;
  questions: QuestionDraft[];
}

interface Props {
  onChange: (data: object) => void;
}

const PART_DEFAULTS = {
  1: {
    partNumber: 1 as const,
    title: 'Personal Questions',
    description: 'The examiner will ask general questions about yourself and familiar topics.',
    questions: Array(4).fill(null).map(() => ({ text: '', bulletPoints: [], timeLimitSecs: 30 })),
  },
  2: {
    partNumber: 2 as const,
    title: 'Long Turn',
    description: 'You will be given a topic card. You have one minute to prepare, then speak for up to two minutes.',
    questions: [{ text: '', bulletPoints: ['', '', ''], timeLimitSecs: 120, prepTimeSecs: 60 }],
  },
  3: {
    partNumber: 3 as const,
    title: 'Discussion',
    description: 'The examiner will ask further questions connected to the topic in Part 2.',
    questions: Array(3).fill(null).map(() => ({ text: '', bulletPoints: [], timeLimitSecs: 45 })),
  },
};

export default function SpeakingBuilder({ onChange }: Props) {
  const [parts, setParts] = useState<[PartDraft, PartDraft, PartDraft]>([
    { ...PART_DEFAULTS[1], questions: PART_DEFAULTS[1].questions.map((q) => ({ ...q })) },
    { ...PART_DEFAULTS[2], questions: PART_DEFAULTS[2].questions.map((q) => ({ ...q })) },
    { ...PART_DEFAULTS[3], questions: PART_DEFAULTS[3].questions.map((q) => ({ ...q })) },
  ]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true, 1: false, 2: false });

  function updatePart(pIdx: number, patch: Partial<PartDraft>) {
    const next = parts.map((p, i) => (i === pIdx ? { ...p, ...patch } : p)) as [PartDraft, PartDraft, PartDraft];
    setParts(next);
    onChange(build(next));
  }

  function updateQuestion(pIdx: number, qIdx: number, patch: Partial<QuestionDraft>) {
    const qs = parts[pIdx].questions.map((q, i) => (i === qIdx ? { ...q, ...patch } : q));
    updatePart(pIdx, { questions: qs });
  }

  function addQuestion(pIdx: number) {
    const part = parts[pIdx];
    const newQ: QuestionDraft = {
      text: '',
      bulletPoints: [],
      timeLimitSecs: part.partNumber === 1 ? 30 : part.partNumber === 2 ? 120 : 45,
      prepTimeSecs: part.partNumber === 2 ? 60 : undefined,
    };
    updatePart(pIdx, { questions: [...part.questions, newQ] });
  }

  function removeQuestion(pIdx: number, qIdx: number) {
    if (parts[pIdx].questions.length <= 1) return;
    updatePart(pIdx, { questions: parts[pIdx].questions.filter((_, i) => i !== qIdx) });
  }

  function updateBullet(pIdx: number, qIdx: number, bIdx: number, val: string) {
    const bullets = [...parts[pIdx].questions[qIdx].bulletPoints];
    bullets[bIdx] = val;
    updateQuestion(pIdx, qIdx, { bulletPoints: bullets });
  }

  function addBullet(pIdx: number, qIdx: number) {
    const bullets = [...parts[pIdx].questions[qIdx].bulletPoints, ''];
    updateQuestion(pIdx, qIdx, { bulletPoints: bullets });
  }

  function removeBullet(pIdx: number, qIdx: number, bIdx: number) {
    const bullets = parts[pIdx].questions[qIdx].bulletPoints.filter((_, i) => i !== bIdx);
    updateQuestion(pIdx, qIdx, { bulletPoints: bullets });
  }

  function build(ps: [PartDraft, PartDraft, PartDraft]) {
    return {
      parts: ps.map((part, pIdx) => ({
        partNumber: part.partNumber,
        title: part.title,
        description: part.description,
        questions: part.questions.map((q, qIdx) => ({
          questionNumber: qIdx + 1,
          text: q.text,
          ...(q.bulletPoints.length > 0 ? { bulletPoints: q.bulletPoints.filter(Boolean) } : {}),
          timeLimitSecs: q.timeLimitSecs,
          ...(pIdx === 1 ? { prepTimeSecs: q.prepTimeSecs ?? 60 } : {}),
        })),
      })),
    };
  }

  const PART_LABELS = ['Personal Questions', 'Long Turn', 'Discussion'];
  const TIME_LABELS: Record<number, string> = { 1: '30s per Q', 2: '60s prep + 2min', 3: '45s per Q' };

  return (
    <div className="space-y-3">
      {parts.map((part, pIdx) => (
        <div key={pIdx} className="border border-gray-200 rounded-xl overflow-hidden">
          {/* Accordion header */}
          <button
            type="button"
            onClick={() => setExpanded((e) => ({ ...e, [pIdx]: !e[pIdx] }))}
            className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                Part {part.partNumber}
              </span>
              <span className="text-sm font-medium text-slate-700">{PART_LABELS[pIdx]}</span>
              <span className="text-xs text-slate-400">{TIME_LABELS[part.partNumber]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{part.questions.length} question{part.questions.length !== 1 ? 's' : ''}</span>
              <span className={`text-slate-400 transition-transform ${expanded[pIdx] ? 'rotate-180' : ''}`}>▾</span>
            </div>
          </button>

          {expanded[pIdx] && (
            <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/40">
              {/* Part metadata */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Part Title</label>
                  <input
                    type="text"
                    value={part.title}
                    onChange={(e) => updatePart(pIdx, { title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Part Description</label>
                  <input
                    type="text"
                    value={part.description}
                    onChange={(e) => updatePart(pIdx, { description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                {part.questions.map((q, qIdx) => (
                  <div key={qIdx} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Q{qIdx + 1}</span>
                      {part.partNumber !== 2 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(pIdx, qIdx)}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Question</label>
                      <textarea
                        value={q.text}
                        onChange={(e) => updateQuestion(pIdx, qIdx, { text: e.target.value })}
                        rows={2}
                        placeholder={
                          pIdx === 0 ? 'e.g. Do you enjoy cooking?' :
                          pIdx === 1 ? 'e.g. Describe a memorable trip you have taken.' :
                          'e.g. Why do you think people enjoy travelling to other countries?'
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>

                    {/* Part 2 bullet points */}
                    {pIdx === 1 && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Cue Card Bullet Points</label>
                        <div className="space-y-2">
                          {q.bulletPoints.map((bp, bIdx) => (
                            <div key={bIdx} className="flex gap-2">
                              <input
                                type="text"
                                value={bp}
                                onChange={(e) => updateBullet(pIdx, qIdx, bIdx, e.target.value)}
                                placeholder={`e.g. where you went and who you went with`}
                                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                              />
                              <button
                                type="button"
                                onClick={() => removeBullet(pIdx, qIdx, bIdx)}
                                className="text-xs text-red-400 hover:text-red-600 px-2"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addBullet(pIdx, qIdx)}
                            className="text-xs text-primary hover:underline"
                          >
                            + Add bullet point
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <div className="w-36">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Time Limit (secs)</label>
                        <input
                          type="number"
                          value={q.timeLimitSecs}
                          onChange={(e) => updateQuestion(pIdx, qIdx, { timeLimitSecs: parseInt(e.target.value) || 30 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      {pIdx === 1 && (
                        <div className="w-36">
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Prep Time (secs)</label>
                          <input
                            type="number"
                            value={q.prepTimeSecs ?? 60}
                            onChange={(e) => updateQuestion(pIdx, qIdx, { prepTimeSecs: parseInt(e.target.value) || 60 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {part.partNumber !== 2 && (
                <button
                  type="button"
                  onClick={() => addQuestion(pIdx)}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors"
                >
                  + Add Question
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
