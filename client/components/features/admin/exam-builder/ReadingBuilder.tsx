'use client';

import { useState } from 'react';
import SortDropdown from '@/components/ui/SortDropdown';

// ── Types ──────────────────────────────────────────────────────────────────────

type ReadingGroupType =
  | 'multiple-choice'
  | 'true-false-not-given'
  | 'yes-no-not-given'
  | 'sentence-completion'
  | 'short-answer'
  | 'matching-headings'
  | 'matching-features-ending'
  | 'diagram-label-completion';

interface QuestionDraft {
  text: string;
  answer: string;
  beforeBlank?: string;
  afterBlank?: string;
  wordLimit?: number;
  paragraphLabel?: string;
  options?: { letter: string; text: string }[];
}

interface GroupDraft {
  type: ReadingGroupType;
  instruction: string;
  // matching-headings
  headingOptions?: { label: string; text: string }[];
  // matching-features-ending / diagram-label
  options?: { letter: string; text: string }[];
  diagramDescription?: string;
  diagramImageUrl?: string;
  questions: QuestionDraft[];
}

interface PassageDraft {
  title: string;
  subtitle: string;
  paragraphs: { label: string; heading: string; text: string }[];
}

interface PartDraft {
  passage: PassageDraft;
  groups: GroupDraft[];
}

interface Props {
  onChange: (data: object) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const GROUP_TYPE_OPTIONS: { value: ReadingGroupType; label: string }[] = [
  { value: 'multiple-choice', label: 'Multiple Choice (A/B/C/D)' },
  { value: 'true-false-not-given', label: 'True / False / Not Given' },
  { value: 'yes-no-not-given', label: 'Yes / No / Not Given' },
  { value: 'sentence-completion', label: 'Sentence Completion' },
  { value: 'short-answer', label: 'Short Answer' },
  { value: 'matching-headings', label: 'Matching Headings' },
  { value: 'matching-features-ending', label: 'Matching Features / Sentence Endings' },
  { value: 'diagram-label-completion', label: 'Diagram Label Completion' },
];

const TFNG_OPTIONS = ['TRUE', 'FALSE', 'NOT GIVEN'];
const YNNG_OPTIONS = ['YES', 'NO', 'NOT GIVEN'];

function newGroup(type: ReadingGroupType): GroupDraft {
  const base = { type, instruction: '', questions: [newQuestion(type)] };
  if (type === 'matching-headings')
    return { ...base, headingOptions: [{ label: 'i', text: '' }, { label: 'ii', text: '' }] };
  if (type === 'matching-features-ending')
    return { ...base, options: [{ letter: 'A', text: '' }, { letter: 'B', text: '' }] };
  if (type === 'diagram-label-completion')
    return { ...base, diagramDescription: '', diagramImageUrl: '' };
  return base;
}

function newQuestion(type: ReadingGroupType): QuestionDraft {
  if (type === 'multiple-choice')
    return { text: '', answer: 'A', options: [{ letter: 'A', text: '' }, { letter: 'B', text: '' }, { letter: 'C', text: '' }] };
  if (type === 'true-false-not-given') return { text: '', answer: 'TRUE' };
  if (type === 'yes-no-not-given')     return { text: '', answer: 'YES' };
  if (type === 'sentence-completion')  return { text: '', answer: '', beforeBlank: '', afterBlank: '', wordLimit: 2 };
  if (type === 'short-answer')         return { text: '', answer: '', wordLimit: 3 };
  if (type === 'matching-headings')    return { text: '', answer: '', paragraphLabel: 'A' };
  return { text: '', answer: '' };
}

function emptyPart(): PartDraft {
  return {
    passage: { title: '', subtitle: '', paragraphs: [{ label: 'A', heading: '', text: '' }] },
    groups: [],
  };
}

function buildJSON(parts: [PartDraft, PartDraft, PartDraft]) {
  let qNum = 1;
  return {
    durationMins: 60,
    totalQuestions: parts.reduce((s, p) => s + p.groups.reduce((gs, g) => gs + g.questions.length, 0), 0),
    parts: parts.map((part, pIdx) => ({
      partNumber: pIdx + 1,
      questionRange: (() => {
        const from = qNum;
        const count = part.groups.reduce((s, g) => s + g.questions.length, 0);
        const to = from + count - 1;
        return { from, to };
      })(),
      passage: {
        title: part.passage.title,
        ...(part.passage.subtitle ? { subtitle: part.passage.subtitle } : {}),
        paragraphs: part.passage.paragraphs.map((p) => ({
          ...(p.label ? { label: p.label } : {}),
          ...(p.heading ? { heading: p.heading } : {}),
          text: p.text,
        })),
      },
      questionGroups: part.groups.map((g) => {
        const from = qNum;
        const questions = g.questions.map((q) => {
          const num = qNum++;
          if (g.type === 'multiple-choice')
            return { type: g.type, number: num, text: q.text, options: q.options, answer: q.answer };
          if (g.type === 'true-false-not-given' || g.type === 'yes-no-not-given')
            return { type: g.type, number: num, text: q.text, answer: q.answer };
          if (g.type === 'sentence-completion')
            return { type: g.type, number: num, beforeBlank: q.beforeBlank, afterBlank: q.afterBlank, answer: q.answer, ...(q.wordLimit ? { wordLimit: q.wordLimit } : {}) };
          if (g.type === 'short-answer')
            return { type: g.type, number: num, text: q.text, answer: q.answer, ...(q.wordLimit ? { wordLimit: q.wordLimit } : {}) };
          if (g.type === 'matching-headings')
            return { type: g.type, number: num, paragraphLabel: q.paragraphLabel, answer: q.answer };
          if (g.type === 'matching-features-ending')
            return { type: g.type, number: num, text: q.text, answer: q.answer };
          return { type: g.type, number: num, text: q.text, answer: q.answer };
        });
        const to = qNum - 1;
        const base = { type: g.type, instruction: g.instruction, questionRange: { from, to }, questions };
        if (g.type === 'matching-headings') return { ...base, headingOptions: g.headingOptions };
        if (g.type === 'matching-features-ending') return { ...base, options: g.options };
        if (g.type === 'diagram-label-completion')
          return { ...base, ...(g.diagramDescription ? { diagramDescription: g.diagramDescription } : {}), ...(g.diagramImageUrl ? { diagramImageUrl: g.diagramImageUrl } : {}) };
        return base;
      }),
    })),
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ReadingBuilder({ onChange }: Props) {
  const [parts, setParts] = useState<[PartDraft, PartDraft, PartDraft]>([emptyPart(), emptyPart(), emptyPart()]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true, 1: false, 2: false });
  const [newGroupType, setNewGroupType] = useState<Record<number, ReadingGroupType>>({ 0: 'multiple-choice', 1: 'multiple-choice', 2: 'multiple-choice' });

  function updatePart(pIdx: number, fn: (p: PartDraft) => PartDraft) {
    const next = parts.map((p, i) => (i === pIdx ? fn(p) : p)) as [PartDraft, PartDraft, PartDraft];
    setParts(next);
    onChange(buildJSON(next));
  }

  function addGroup(pIdx: number, type: ReadingGroupType) {
    updatePart(pIdx, (p) => ({ ...p, groups: [...p.groups, newGroup(type)] }));
  }

  function removeGroup(pIdx: number, gIdx: number) {
    updatePart(pIdx, (p) => ({ ...p, groups: p.groups.filter((_, i) => i !== gIdx) }));
  }

  function updateGroup(pIdx: number, gIdx: number, patch: Partial<GroupDraft>) {
    updatePart(pIdx, (p) => {
      const groups = p.groups.map((g, i) => (i === gIdx ? { ...g, ...patch } : g));
      return { ...p, groups };
    });
  }

  function addQ(pIdx: number, gIdx: number) {
    const type = parts[pIdx].groups[gIdx].type;
    updatePart(pIdx, (p) => {
      const groups = p.groups.map((g, i) => i === gIdx ? { ...g, questions: [...g.questions, newQuestion(type)] } : g);
      return { ...p, groups };
    });
  }

  function removeQ(pIdx: number, gIdx: number, qIdx: number) {
    updatePart(pIdx, (p) => {
      const groups = p.groups.map((g, i) => i === gIdx ? { ...g, questions: g.questions.filter((_, j) => j !== qIdx) } : g);
      return { ...p, groups };
    });
  }

  function updateQ(pIdx: number, gIdx: number, qIdx: number, patch: Partial<QuestionDraft>) {
    updatePart(pIdx, (p) => {
      const groups = p.groups.map((g, gi) => gi === gIdx ? {
        ...g,
        questions: g.questions.map((q, qi) => qi === qIdx ? { ...q, ...patch } : q),
      } : g);
      return { ...p, groups };
    });
  }

  function addParagraph(pIdx: number) {
    updatePart(pIdx, (p) => ({
      ...p,
      passage: { ...p.passage, paragraphs: [...p.passage.paragraphs, { label: '', heading: '', text: '' }] },
    }));
  }

  function removeParagraph(pIdx: number, paraIdx: number) {
    updatePart(pIdx, (p) => ({
      ...p,
      passage: { ...p.passage, paragraphs: p.passage.paragraphs.filter((_, i) => i !== paraIdx) },
    }));
  }

  function updateParagraph(pIdx: number, paraIdx: number, patch: Partial<{ label: string; heading: string; text: string }>) {
    updatePart(pIdx, (p) => ({
      ...p,
      passage: {
        ...p.passage,
        paragraphs: p.passage.paragraphs.map((para, i) => i === paraIdx ? { ...para, ...patch } : para),
      },
    }));
  }

  return (
    <div className="space-y-3">
      {parts.map((part, pIdx) => (
        <div key={pIdx} className="border border-gray-200 rounded-xl overflow-hidden">
          {/* Part accordion header */}
          <button
            type="button"
            onClick={() => setExpanded((e) => ({ ...e, [pIdx]: !e[pIdx] }))}
            className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                Part {pIdx + 1}
              </span>
              {part.passage.title && <span className="text-sm text-slate-600 truncate max-w-xs">{part.passage.title}</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{part.groups.reduce((s, g) => s + g.questions.length, 0)} questions</span>
              <span className={`text-slate-400 transition-transform ${expanded[pIdx] ? 'rotate-180' : ''}`}>▾</span>
            </div>
          </button>

          {expanded[pIdx] && (
            <div className="border-t border-gray-100 p-5 space-y-6 bg-gray-50/40">
              {/* Passage */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Reading Passage</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Passage Title</label>
                    <input
                      type="text"
                      value={part.passage.title}
                      onChange={(e) => updatePart(pIdx, (p) => ({ ...p, passage: { ...p.passage, title: e.target.value } }))}
                      placeholder="e.g. The Rise of Urban Farming"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle (optional)</label>
                    <input
                      type="text"
                      value={part.passage.subtitle}
                      onChange={(e) => updatePart(pIdx, (p) => ({ ...p, passage: { ...p.passage, subtitle: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {part.passage.paragraphs.map((para, paraIdx) => (
                  <div key={paraIdx} className="border border-gray-200 rounded-lg p-4 bg-white space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">Paragraph {paraIdx + 1}</span>
                      <button type="button" onClick={() => removeParagraph(pIdx, paraIdx)} className="ml-auto text-xs text-red-400 hover:text-red-600">Remove</button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Label</label>
                        <input type="text" value={para.label} onChange={(e) => updateParagraph(pIdx, paraIdx, { label: e.target.value })}
                          placeholder="A" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none" />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-xs text-gray-500 mb-1">Heading (optional)</label>
                        <input type="text" value={para.heading} onChange={(e) => updateParagraph(pIdx, paraIdx, { heading: e.target.value })}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none" />
                      </div>
                    </div>
                    <textarea
                      value={para.text}
                      onChange={(e) => updateParagraph(pIdx, paraIdx, { text: e.target.value })}
                      rows={3}
                      placeholder="Paragraph text…"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                ))}
                <button type="button" onClick={() => addParagraph(pIdx)}
                  className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-500 hover:border-primary hover:text-primary transition-colors">
                  + Add Paragraph
                </button>
              </div>

              {/* Question groups */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Question Groups</h4>

                {part.groups.map((group, gIdx) => (
                  <div key={gIdx} className="border border-gray-200 rounded-xl bg-white p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500">Group {gIdx + 1}</span>
                      <SortDropdown
                        options={GROUP_TYPE_OPTIONS}
                        value={group.type}
                        onChange={(v) => updateGroup(pIdx, gIdx, { ...newGroup(v as ReadingGroupType), instruction: group.instruction })}
                      />
                      <button type="button" onClick={() => removeGroup(pIdx, gIdx)} className="ml-auto text-xs text-red-400 hover:text-red-600">Remove group</button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Instruction</label>
                      <input type="text" value={group.instruction} onChange={(e) => updateGroup(pIdx, gIdx, { instruction: e.target.value })}
                        placeholder="e.g. Choose the correct letter, A, B or C."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>

                    {/* Matching headings — heading options */}
                    {group.type === 'matching-headings' && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Heading Options</label>
                        <div className="space-y-1.5">
                          {(group.headingOptions ?? []).map((h, hIdx) => (
                            <div key={hIdx} className="flex gap-2">
                              <input type="text" value={h.label} onChange={(e) => {
                                const ho = [...(group.headingOptions ?? [])]; ho[hIdx] = { ...ho[hIdx], label: e.target.value };
                                updateGroup(pIdx, gIdx, { headingOptions: ho });
                              }} placeholder="i" className="w-12 px-2 py-1.5 border border-gray-300 rounded text-sm font-mono" />
                              <input type="text" value={h.text} onChange={(e) => {
                                const ho = [...(group.headingOptions ?? [])]; ho[hIdx] = { ...ho[hIdx], text: e.target.value };
                                updateGroup(pIdx, gIdx, { headingOptions: ho });
                              }} placeholder="Heading text…" className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                              <button type="button" onClick={() => updateGroup(pIdx, gIdx, { headingOptions: (group.headingOptions ?? []).filter((_, i) => i !== hIdx) })}
                                className="text-red-400 text-xs px-1">✕</button>
                            </div>
                          ))}
                          <button type="button" onClick={() => updateGroup(pIdx, gIdx, { headingOptions: [...(group.headingOptions ?? []), { label: '', text: '' }] })}
                            className="text-xs text-primary hover:underline">+ Add heading option</button>
                        </div>
                      </div>
                    )}

                    {/* Matching features — options list */}
                    {group.type === 'matching-features-ending' && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Options (A, B, C…)</label>
                        <div className="space-y-1.5">
                          {(group.options ?? []).map((opt, oIdx) => (
                            <div key={oIdx} className="flex gap-2">
                              <input type="text" value={opt.letter} readOnly className="w-10 px-2 py-1.5 border border-gray-200 rounded text-sm font-bold text-center bg-gray-50" />
                              <input type="text" value={opt.text} onChange={(e) => {
                                const opts = [...(group.options ?? [])]; opts[oIdx] = { ...opts[oIdx], text: e.target.value };
                                updateGroup(pIdx, gIdx, { options: opts });
                              }} placeholder="Option text…" className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                            </div>
                          ))}
                          <button type="button" onClick={() => {
                            const opts = group.options ?? [];
                            const letter = String.fromCharCode(65 + opts.length);
                            updateGroup(pIdx, gIdx, { options: [...opts, { letter, text: '' }] });
                          }} className="text-xs text-primary hover:underline">+ Add option</button>
                        </div>
                      </div>
                    )}

                    {/* Diagram label */}
                    {group.type === 'diagram-label-completion' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Diagram Description</label>
                          <input type="text" value={group.diagramDescription ?? ''} onChange={(e) => updateGroup(pIdx, gIdx, { diagramDescription: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Diagram Image URL</label>
                          <input type="text" value={group.diagramImageUrl ?? ''} onChange={(e) => updateGroup(pIdx, gIdx, { diagramImageUrl: e.target.value })}
                            placeholder="/images/…" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none" />
                        </div>
                      </div>
                    )}

                    {/* Questions */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-gray-600">Questions</label>
                      {group.questions.map((q, qIdx) => (
                        <div key={qIdx} className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">Q{qIdx + 1}</span>
                            <button type="button" onClick={() => removeQ(pIdx, gIdx, qIdx)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                          </div>

                          {/* MC options */}
                          {group.type === 'multiple-choice' && (
                            <>
                              <input type="text" value={q.text} onChange={(e) => updateQ(pIdx, gIdx, qIdx, { text: e.target.value })}
                                placeholder="Question text…" className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none" />
                              <div className="space-y-1">
                                {(q.options ?? []).map((opt, oIdx) => (
                                  <div key={oIdx} className="flex gap-2">
                                    <input type="text" value={opt.letter} readOnly className="w-8 text-center text-xs font-bold border border-gray-200 rounded bg-white" />
                                    <input type="text" value={opt.text} onChange={(e) => {
                                      const opts = [...(q.options ?? [])]; opts[oIdx] = { ...opts[oIdx], text: e.target.value };
                                      updateQ(pIdx, gIdx, qIdx, { options: opts });
                                    }} placeholder="Option text" className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                                  </div>
                                ))}
                                <button type="button" onClick={() => {
                                  const opts = q.options ?? [];
                                  updateQ(pIdx, gIdx, qIdx, { options: [...opts, { letter: String.fromCharCode(65 + opts.length), text: '' }] });
                                }} className="text-xs text-primary hover:underline">+ Add option</button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Answer:</span>
                                <SortDropdown
                                  options={(q.options ?? []).map((o) => ({ value: o.letter, label: o.letter }))}
                                  value={q.answer}
                                  onChange={(v) => updateQ(pIdx, gIdx, qIdx, { answer: v })}
                                />
                              </div>
                            </>
                          )}

                          {/* TFNG */}
                          {(group.type === 'true-false-not-given' || group.type === 'yes-no-not-given') && (
                            <div className="flex gap-3">
                              <input type="text" value={q.text} onChange={(e) => updateQ(pIdx, gIdx, qIdx, { text: e.target.value })}
                                placeholder="Statement text…" className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none" />
                              <SortDropdown
                                options={(group.type === 'true-false-not-given' ? TFNG_OPTIONS : YNNG_OPTIONS).map((o) => ({ value: o, label: o }))}
                                value={q.answer}
                                onChange={(v) => updateQ(pIdx, gIdx, qIdx, { answer: v })}
                              />
                            </div>
                          )}

                          {/* Sentence completion */}
                          {group.type === 'sentence-completion' && (
                            <div className="space-y-1.5">
                              <div className="grid grid-cols-2 gap-2">
                                <input type="text" value={q.beforeBlank ?? ''} onChange={(e) => updateQ(pIdx, gIdx, qIdx, { beforeBlank: e.target.value })}
                                  placeholder="Text before blank…" className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none" />
                                <input type="text" value={q.afterBlank ?? ''} onChange={(e) => updateQ(pIdx, gIdx, qIdx, { afterBlank: e.target.value })}
                                  placeholder="Text after blank…" className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none" />
                              </div>
                              <div className="flex gap-2">
                                <input type="text" value={q.answer} onChange={(e) => updateQ(pIdx, gIdx, qIdx, { answer: e.target.value })}
                                  placeholder="Answer" className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none" />
                                <input type="number" value={q.wordLimit ?? ''} onChange={(e) => updateQ(pIdx, gIdx, qIdx, { wordLimit: parseInt(e.target.value) || undefined })}
                                  placeholder="Word limit" className="w-28 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none" />
                              </div>
                            </div>
                          )}

                          {/* Short answer */}
                          {group.type === 'short-answer' && (
                            <div className="flex gap-2">
                              <input type="text" value={q.text} onChange={(e) => updateQ(pIdx, gIdx, qIdx, { text: e.target.value })}
                                placeholder="Question text…" className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none" />
                              <input type="text" value={q.answer} onChange={(e) => updateQ(pIdx, gIdx, qIdx, { answer: e.target.value })}
                                placeholder="Answer" className="w-36 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none" />
                              <input type="number" value={q.wordLimit ?? ''} onChange={(e) => updateQ(pIdx, gIdx, qIdx, { wordLimit: parseInt(e.target.value) || undefined })}
                                placeholder="Limit" className="w-20 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none" />
                            </div>
                          )}

                          {/* Matching headings */}
                          {group.type === 'matching-headings' && (
                            <div className="flex gap-2">
                              <input type="text" value={q.paragraphLabel ?? ''} onChange={(e) => updateQ(pIdx, gIdx, qIdx, { paragraphLabel: e.target.value })}
                                placeholder="Para label (A)" className="w-24 px-3 py-1.5 border border-gray-300 rounded text-sm font-mono focus:outline-none" />
                              <input type="text" value={q.answer} onChange={(e) => updateQ(pIdx, gIdx, qIdx, { answer: e.target.value })}
                                placeholder="Heading label (e.g. iii)" className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm font-mono focus:outline-none" />
                            </div>
                          )}

                          {/* Matching features / diagram */}
                          {(group.type === 'matching-features-ending' || group.type === 'diagram-label-completion') && (
                            <div className="flex gap-2">
                              <input type="text" value={q.text} onChange={(e) => updateQ(pIdx, gIdx, qIdx, { text: e.target.value })}
                                placeholder="Question text…" className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none" />
                              <input type="text" value={q.answer} onChange={(e) => updateQ(pIdx, gIdx, qIdx, { answer: e.target.value })}
                                placeholder="Answer" className="w-32 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none" />
                            </div>
                          )}
                        </div>
                      ))}

                      <button type="button" onClick={() => addQ(pIdx, gIdx)}
                        className="w-full py-1.5 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-primary hover:text-primary transition-colors">
                        + Add Question
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add group */}
                <div className="flex gap-2 items-center">
                  <SortDropdown
                    options={GROUP_TYPE_OPTIONS}
                    value={newGroupType[pIdx] ?? 'multiple-choice'}
                    onChange={(v) => setNewGroupType((prev) => ({ ...prev, [pIdx]: v as ReadingGroupType }))}
                  />
                  <button
                    type="button"
                    onClick={() => addGroup(pIdx, newGroupType[pIdx] ?? 'multiple-choice')}
                    className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
                  >
                    + Add Group
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
