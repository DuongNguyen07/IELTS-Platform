'use client';

import { useState } from 'react';
import SortDropdown from '@/components/ui/SortDropdown';

// ── Types ──────────────────────────────────────────────────────────────────────

type ListeningGroupType =
  | 'multiple-choice'
  | 'multiple-choice-many'
  | 'form-completion'
  | 'note-completion'
  | 'table-completion'
  | 'matching'
  | 'plan-map-diagram'
  | 'summary-completion'
  | 'flow-chart-completion'
  | 'short-answer'
  | 'sentence-completion';

interface QuestionDraft {
  text: string;
  answer: string;
  answers?: string[];
  fieldLabel?: string;
  beforeBlank?: string;
  afterBlank?: string;
  locationLabel?: string;
  rowLabel?: string;
  columnLabel?: string;
  wordLimit?: number;
  options?: { letter: string; text: string }[];
  chooseCount?: number;
}

interface GroupDraft {
  type: ListeningGroupType;
  instruction: string;
  // group-level metadata
  formTitle?: string;
  notesTitle?: string;
  tableTitle?: string;
  columnHeaders?: string[];
  chartTitle?: string;
  summaryTitle?: string;
  imageUrl?: string;
  imageDescription?: string;
  options?: { letter: string; text: string }[];
  questions: QuestionDraft[];
}

interface SectionDraft {
  audioUrl: string;
  groups: GroupDraft[];
}

interface Props {
  onChange: (data: object) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const GROUP_TYPE_OPTIONS: { value: ListeningGroupType; label: string }[] = [
  { value: 'multiple-choice',       label: 'Multiple Choice (A/B/C)' },
  { value: 'multiple-choice-many',  label: 'Multiple Choice (choose many)' },
  { value: 'form-completion',       label: 'Form Completion' },
  { value: 'note-completion',       label: 'Note Completion' },
  { value: 'table-completion',      label: 'Table Completion' },
  { value: 'matching',              label: 'Matching' },
  { value: 'plan-map-diagram',      label: 'Plan / Map / Diagram' },
  { value: 'summary-completion',    label: 'Summary Completion' },
  { value: 'flow-chart-completion', label: 'Flow Chart Completion' },
  { value: 'short-answer',          label: 'Short Answer' },
  { value: 'sentence-completion',   label: 'Sentence Completion' },
];

function newQuestion(type: ListeningGroupType): QuestionDraft {
  if (type === 'multiple-choice')
    return { text: '', answer: 'A', options: [{ letter: 'A', text: '' }, { letter: 'B', text: '' }, { letter: 'C', text: '' }] };
  if (type === 'multiple-choice-many')
    return { text: '', answer: '', answers: [], chooseCount: 2, options: [{ letter: 'A', text: '' }, { letter: 'B', text: '' }, { letter: 'C', text: '' }] };
  if (type === 'form-completion')   return { text: '', answer: '', fieldLabel: '', wordLimit: 2 };
  if (type === 'note-completion')   return { text: '', answer: '', beforeBlank: '', afterBlank: '', wordLimit: 2 };
  if (type === 'table-completion')  return { text: '', answer: '', rowLabel: '', columnLabel: '', beforeBlank: '', afterBlank: '', wordLimit: 2 };
  if (type === 'matching')          return { text: '', answer: '' };
  if (type === 'plan-map-diagram')  return { text: '', answer: '', locationLabel: '', wordLimit: 2 };
  if (type === 'summary-completion' || type === 'flow-chart-completion' || type === 'sentence-completion')
    return { text: '', answer: '', beforeBlank: '', afterBlank: '', wordLimit: 2 };
  return { text: '', answer: '', wordLimit: 3 };
}

function newGroup(type: ListeningGroupType): GroupDraft {
  const base = { type, instruction: '', questions: [newQuestion(type)] };
  if (type === 'matching')
    return { ...base, options: [{ letter: 'A', text: '' }, { letter: 'B', text: '' }] };
  if (type === 'plan-map-diagram')
    return { ...base, imageUrl: '', imageDescription: '' };
  if (type === 'form-completion')   return { ...base, formTitle: '' };
  if (type === 'note-completion')   return { ...base, notesTitle: '' };
  if (type === 'table-completion')  return { ...base, tableTitle: '', columnHeaders: ['', ''] };
  if (type === 'summary-completion') return { ...base, summaryTitle: '' };
  if (type === 'flow-chart-completion') return { ...base, chartTitle: '' };
  return base;
}

function emptySection(): SectionDraft {
  return { audioUrl: '', groups: [] };
}

function buildJSON(sections: [SectionDraft, SectionDraft, SectionDraft, SectionDraft]) {
  let qNum = 1;
  return {
    durationMins: 30,
    totalQuestions: sections.reduce((s, sec) => s + sec.groups.reduce((gs, g) => gs + g.questions.length, 0), 0),
    sections: sections.map((section, sIdx) => ({
      sectionNumber: sIdx + 1,
      audioUrl: section.audioUrl || undefined,
      questionRange: (() => {
        const from = qNum;
        const count = section.groups.reduce((s, g) => s + g.questions.length, 0);
        return { from, to: from + count - 1 };
      })(),
      questionGroups: section.groups.map((g) => {
        const from = qNum;
        const questions = g.questions.map((q) => {
          const num = qNum++;
          const base = { number: num };
          if (g.type === 'multiple-choice')
            return { ...base, type: g.type, text: q.text, options: q.options, answer: q.answer };
          if (g.type === 'multiple-choice-many')
            return { ...base, type: g.type, text: q.text, options: q.options, chooseCount: q.chooseCount ?? 2, answers: q.answers ?? [] };
          if (g.type === 'form-completion')
            return { ...base, type: g.type, fieldLabel: q.fieldLabel, answer: q.answer, ...(q.wordLimit ? { wordLimit: q.wordLimit } : {}) };
          if (g.type === 'note-completion' || g.type === 'summary-completion' || g.type === 'flow-chart-completion' || g.type === 'sentence-completion')
            return { ...base, type: g.type, beforeBlank: q.beforeBlank, afterBlank: q.afterBlank, answer: q.answer, ...(q.wordLimit ? { wordLimit: q.wordLimit } : {}) };
          if (g.type === 'table-completion')
            return { ...base, type: g.type, rowLabel: q.rowLabel, columnLabel: q.columnLabel, beforeBlank: q.beforeBlank, afterBlank: q.afterBlank, answer: q.answer, ...(q.wordLimit ? { wordLimit: q.wordLimit } : {}) };
          if (g.type === 'matching')
            return { ...base, type: g.type, text: q.text, answer: q.answer };
          if (g.type === 'plan-map-diagram')
            return { ...base, type: g.type, locationLabel: q.locationLabel, answer: q.answer, ...(q.wordLimit ? { wordLimit: q.wordLimit } : {}) };
          return { ...base, type: g.type, text: q.text, answer: q.answer, ...(q.wordLimit ? { wordLimit: q.wordLimit } : {}) };
        });
        const to = qNum - 1;
        const base = { type: g.type, instruction: g.instruction, questionRange: { from, to }, questions };
        if (g.type === 'form-completion')      return { ...base, ...(g.formTitle   ? { formTitle: g.formTitle }     : {}) };
        if (g.type === 'note-completion')      return { ...base, ...(g.notesTitle  ? { notesTitle: g.notesTitle }   : {}) };
        if (g.type === 'table-completion')     return { ...base, ...(g.tableTitle  ? { tableTitle: g.tableTitle }   : {}), ...(g.columnHeaders ? { columnHeaders: g.columnHeaders } : {}) };
        if (g.type === 'summary-completion')   return { ...base, ...(g.summaryTitle ? { summaryTitle: g.summaryTitle } : {}) };
        if (g.type === 'flow-chart-completion')return { ...base, ...(g.chartTitle  ? { chartTitle: g.chartTitle }  : {}) };
        if (g.type === 'matching')             return { ...base, options: g.options };
        if (g.type === 'plan-map-diagram')     return { ...base, ...(g.imageUrl ? { imageUrl: g.imageUrl } : {}), ...(g.imageDescription ? { imageDescription: g.imageDescription } : {}) };
        return base;
      }),
    })),
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ListeningBuilder({ onChange }: Props) {
  const [sections, setSections] = useState<[SectionDraft, SectionDraft, SectionDraft, SectionDraft]>([
    emptySection(), emptySection(), emptySection(), emptySection(),
  ]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true, 1: false, 2: false, 3: false });
  const [newGroupType, setNewGroupType] = useState<Record<number, ListeningGroupType>>({ 0: 'form-completion', 1: 'form-completion', 2: 'multiple-choice', 3: 'multiple-choice' });

  function updateSection(sIdx: number, fn: (s: SectionDraft) => SectionDraft) {
    const next = sections.map((s, i) => (i === sIdx ? fn(s) : s)) as [SectionDraft, SectionDraft, SectionDraft, SectionDraft];
    setSections(next);
    onChange(buildJSON(next));
  }

  function addGroup(sIdx: number, type: ListeningGroupType) {
    updateSection(sIdx, (s) => ({ ...s, groups: [...s.groups, newGroup(type)] }));
  }

  function removeGroup(sIdx: number, gIdx: number) {
    updateSection(sIdx, (s) => ({ ...s, groups: s.groups.filter((_, i) => i !== gIdx) }));
  }

  function updateGroup(sIdx: number, gIdx: number, patch: Partial<GroupDraft>) {
    updateSection(sIdx, (s) => ({ ...s, groups: s.groups.map((g, i) => i === gIdx ? { ...g, ...patch } : g) }));
  }

  function addQ(sIdx: number, gIdx: number) {
    const type = sections[sIdx].groups[gIdx].type;
    updateSection(sIdx, (s) => ({
      ...s,
      groups: s.groups.map((g, i) => i === gIdx ? { ...g, questions: [...g.questions, newQuestion(type)] } : g),
    }));
  }

  function removeQ(sIdx: number, gIdx: number, qIdx: number) {
    updateSection(sIdx, (s) => ({
      ...s,
      groups: s.groups.map((g, i) => i === gIdx ? { ...g, questions: g.questions.filter((_, j) => j !== qIdx) } : g),
    }));
  }

  function updateQ(sIdx: number, gIdx: number, qIdx: number, patch: Partial<QuestionDraft>) {
    updateSection(sIdx, (s) => ({
      ...s,
      groups: s.groups.map((g, gi) => gi === gIdx ? {
        ...g,
        questions: g.questions.map((q, qi) => qi === qIdx ? { ...q, ...patch } : q),
      } : g),
    }));
  }

  const SECTION_LABELS = ['Everyday Social Context', 'Community / Informational', 'Academic Discussion', 'University Lecture'];

  return (
    <div className="space-y-3">
      {sections.map((section, sIdx) => (
        <div key={sIdx} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setExpanded((e) => ({ ...e, [sIdx]: !e[sIdx] }))}
            className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                Section {sIdx + 1}
              </span>
              <span className="text-xs text-slate-400">{SECTION_LABELS[sIdx]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{section.groups.reduce((s, g) => s + g.questions.length, 0)} questions</span>
              <span className={`text-slate-400 transition-transform ${expanded[sIdx] ? 'rotate-180' : ''}`}>▾</span>
            </div>
          </button>

          {expanded[sIdx] && (
            <div className="border-t border-gray-100 p-5 space-y-5 bg-gray-50/40">
              {/* Audio URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Audio File URL</label>
                <input
                  type="text"
                  value={section.audioUrl}
                  onChange={(e) => updateSection(sIdx, (s) => ({ ...s, audioUrl: e.target.value }))}
                  placeholder="/audio/lt-001/section-1.mp3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <p className="text-xs text-gray-400 mt-1">Place audio in <code className="bg-gray-100 px-1 rounded">public/audio/[slug]/</code></p>
              </div>

              {/* Question groups */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Question Groups</h4>

                {section.groups.map((group, gIdx) => (
                  <div key={gIdx} className="border border-gray-200 rounded-xl bg-white p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500">Group {gIdx + 1}</span>
                      <SortDropdown
                        options={GROUP_TYPE_OPTIONS}
                        value={group.type}
                        onChange={(v) => updateGroup(sIdx, gIdx, { ...newGroup(v as ListeningGroupType), instruction: group.instruction })}
                      />
                      <button type="button" onClick={() => removeGroup(sIdx, gIdx)} className="ml-auto text-xs text-red-400 hover:text-red-600">Remove group</button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Instruction</label>
                      <input type="text" value={group.instruction} onChange={(e) => updateGroup(sIdx, gIdx, { instruction: e.target.value })}
                        placeholder="e.g. Complete the form below. Write NO MORE THAN TWO WORDS…"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>

                    {/* Group-level metadata fields */}
                    {group.type === 'form-completion' && (
                      <input type="text" value={group.formTitle ?? ''} onChange={(e) => updateGroup(sIdx, gIdx, { formTitle: e.target.value })}
                        placeholder="Form title (e.g. Riverside Sports Centre Registration)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                    )}
                    {group.type === 'note-completion' && (
                      <input type="text" value={group.notesTitle ?? ''} onChange={(e) => updateGroup(sIdx, gIdx, { notesTitle: e.target.value })}
                        placeholder="Notes title (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                    )}
                    {group.type === 'summary-completion' && (
                      <input type="text" value={group.summaryTitle ?? ''} onChange={(e) => updateGroup(sIdx, gIdx, { summaryTitle: e.target.value })}
                        placeholder="Summary title (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                    )}
                    {group.type === 'flow-chart-completion' && (
                      <input type="text" value={group.chartTitle ?? ''} onChange={(e) => updateGroup(sIdx, gIdx, { chartTitle: e.target.value })}
                        placeholder="Flow chart title (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                    )}
                    {group.type === 'table-completion' && (
                      <div className="space-y-2">
                        <input type="text" value={group.tableTitle ?? ''} onChange={(e) => updateGroup(sIdx, gIdx, { tableTitle: e.target.value })}
                          placeholder="Table title (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                        <div className="flex gap-2 flex-wrap">
                          {(group.columnHeaders ?? []).map((h, hIdx) => (
                            <input key={hIdx} type="text" value={h} onChange={(e) => {
                              const headers = [...(group.columnHeaders ?? [])]; headers[hIdx] = e.target.value;
                              updateGroup(sIdx, gIdx, { columnHeaders: headers });
                            }} placeholder={`Column ${hIdx + 1}`} className="w-32 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none" />
                          ))}
                          <button type="button" onClick={() => updateGroup(sIdx, gIdx, { columnHeaders: [...(group.columnHeaders ?? []), ''] })}
                            className="text-xs text-primary hover:underline px-2">+ Column</button>
                        </div>
                      </div>
                    )}
                    {group.type === 'plan-map-diagram' && (
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" value={group.imageUrl ?? ''} onChange={(e) => updateGroup(sIdx, gIdx, { imageUrl: e.target.value })}
                          placeholder="Image URL" className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none" />
                        <input type="text" value={group.imageDescription ?? ''} onChange={(e) => updateGroup(sIdx, gIdx, { imageDescription: e.target.value })}
                          placeholder="Image description (optional)" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                      </div>
                    )}
                    {group.type === 'matching' && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Match Options (A, B, C…)</label>
                        <div className="space-y-1.5">
                          {(group.options ?? []).map((opt, oIdx) => (
                            <div key={oIdx} className="flex gap-2">
                              <input type="text" value={opt.letter} readOnly className="w-10 px-2 py-1.5 border border-gray-200 rounded text-sm font-bold text-center bg-gray-50" />
                              <input type="text" value={opt.text} onChange={(e) => {
                                const opts = [...(group.options ?? [])]; opts[oIdx] = { ...opts[oIdx], text: e.target.value };
                                updateGroup(sIdx, gIdx, { options: opts });
                              }} placeholder="Option text…" className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                            </div>
                          ))}
                          <button type="button" onClick={() => {
                            const opts = group.options ?? [];
                            updateGroup(sIdx, gIdx, { options: [...opts, { letter: String.fromCharCode(65 + opts.length), text: '' }] });
                          }} className="text-xs text-primary hover:underline">+ Add option</button>
                        </div>
                      </div>
                    )}

                    {/* Questions */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-gray-600">Questions</label>
                      {group.questions.map((q, qIdx) => (
                        <div key={qIdx} className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-slate-500">Q{qIdx + 1}</span>
                            <button type="button" onClick={() => removeQ(sIdx, gIdx, qIdx)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                          </div>

                          {/* Multiple choice */}
                          {(group.type === 'multiple-choice' || group.type === 'multiple-choice-many') && (
                            <>
                              <input type="text" value={q.text} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { text: e.target.value })}
                                placeholder="Question text…" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none" />
                              <div className="space-y-1">
                                {(q.options ?? []).map((opt, oIdx) => (
                                  <div key={oIdx} className="flex gap-2">
                                    <span className="w-6 text-center text-xs font-bold pt-2 text-slate-500">{opt.letter}</span>
                                    <input type="text" value={opt.text} onChange={(e) => {
                                      const opts = [...(q.options ?? [])]; opts[oIdx] = { ...opts[oIdx], text: e.target.value };
                                      updateQ(sIdx, gIdx, qIdx, { options: opts });
                                    }} placeholder="Option text" className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                                  </div>
                                ))}
                                <button type="button" onClick={() => {
                                  const opts = q.options ?? [];
                                  updateQ(sIdx, gIdx, qIdx, { options: [...opts, { letter: String.fromCharCode(65 + opts.length), text: '' }] });
                                }} className="text-xs text-primary hover:underline">+ Option</button>
                              </div>
                              {group.type === 'multiple-choice' && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">Answer:</span>
                                  <SortDropdown
                                    options={(q.options ?? []).map((o) => ({ value: o.letter, label: o.letter }))}
                                    value={q.answer}
                                    onChange={(v) => updateQ(sIdx, gIdx, qIdx, { answer: v })}
                                  />
                                </div>
                              )}
                              {group.type === 'multiple-choice-many' && (
                                <div className="flex gap-3 items-center">
                                  <span className="text-xs text-gray-500">Answers (comma sep):</span>
                                  <input type="text" value={(q.answers ?? []).join(',')} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { answers: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                    placeholder="A,C" className="w-24 px-2 py-1 border border-gray-300 rounded text-sm" />
                                  <span className="text-xs text-gray-500">Choose:</span>
                                  <input type="number" value={q.chooseCount ?? 2} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { chooseCount: parseInt(e.target.value) || 2 })}
                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm" />
                                </div>
                              )}
                            </>
                          )}

                          {/* Form completion */}
                          {group.type === 'form-completion' && (
                            <div className="flex gap-2">
                              <input type="text" value={q.fieldLabel ?? ''} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { fieldLabel: e.target.value })}
                                placeholder="Field label (e.g. Full Name)" className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                              <input type="text" value={q.answer} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { answer: e.target.value })}
                                placeholder="Answer" className="w-32 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                              <input type="number" value={q.wordLimit ?? ''} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { wordLimit: parseInt(e.target.value) || undefined })}
                                placeholder="Limit" className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                            </div>
                          )}

                          {/* Note / Summary / Flow chart / Sentence completion */}
                          {['note-completion', 'summary-completion', 'flow-chart-completion', 'sentence-completion'].includes(group.type) && (
                            <div className="space-y-1.5">
                              <div className="flex gap-2">
                                <input type="text" value={q.beforeBlank ?? ''} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { beforeBlank: e.target.value })}
                                  placeholder="Before blank…" className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                                <input type="text" value={q.afterBlank ?? ''} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { afterBlank: e.target.value })}
                                  placeholder="After blank…" className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                              </div>
                              <div className="flex gap-2">
                                <input type="text" value={q.answer} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { answer: e.target.value })}
                                  placeholder="Answer" className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                                <input type="number" value={q.wordLimit ?? ''} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { wordLimit: parseInt(e.target.value) || undefined })}
                                  placeholder="Word limit" className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                              </div>
                            </div>
                          )}

                          {/* Table completion */}
                          {group.type === 'table-completion' && (
                            <div className="space-y-1.5">
                              <div className="flex gap-2">
                                <input type="text" value={q.rowLabel ?? ''} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { rowLabel: e.target.value })}
                                  placeholder="Row label" className="w-28 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                                <input type="text" value={q.columnLabel ?? ''} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { columnLabel: e.target.value })}
                                  placeholder="Column label" className="w-28 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                                <input type="text" value={q.beforeBlank ?? ''} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { beforeBlank: e.target.value })}
                                  placeholder="Before blank" className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                              </div>
                              <div className="flex gap-2">
                                <input type="text" value={q.afterBlank ?? ''} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { afterBlank: e.target.value })}
                                  placeholder="After blank" className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                                <input type="text" value={q.answer} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { answer: e.target.value })}
                                  placeholder="Answer" className="w-32 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                                <input type="number" value={q.wordLimit ?? ''} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { wordLimit: parseInt(e.target.value) || undefined })}
                                  placeholder="Limit" className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                              </div>
                            </div>
                          )}

                          {/* Matching */}
                          {group.type === 'matching' && (
                            <div className="flex gap-2">
                              <input type="text" value={q.text} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { text: e.target.value })}
                                placeholder="e.g. Visitor centre" className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                              <SortDropdown
                                options={(group.options ?? []).map((o) => ({ value: o.letter, label: o.letter }))}
                                value={q.answer}
                                onChange={(v) => updateQ(sIdx, gIdx, qIdx, { answer: v })}
                              />
                            </div>
                          )}

                          {/* Plan / Map / Diagram */}
                          {group.type === 'plan-map-diagram' && (
                            <div className="flex gap-2">
                              <input type="text" value={q.locationLabel ?? ''} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { locationLabel: e.target.value })}
                                placeholder="Location label (e.g. Building near main entrance)" className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                              <input type="text" value={q.answer} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { answer: e.target.value })}
                                placeholder="Answer" className="w-36 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                              <input type="number" value={q.wordLimit ?? ''} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { wordLimit: parseInt(e.target.value) || undefined })}
                                placeholder="Limit" className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                            </div>
                          )}

                          {/* Short answer */}
                          {group.type === 'short-answer' && (
                            <div className="flex gap-2">
                              <input type="text" value={q.text} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { text: e.target.value })}
                                placeholder="Question text…" className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                              <input type="text" value={q.answer} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { answer: e.target.value })}
                                placeholder="Answer" className="w-36 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                              <input type="number" value={q.wordLimit ?? ''} onChange={(e) => updateQ(sIdx, gIdx, qIdx, { wordLimit: parseInt(e.target.value) || undefined })}
                                placeholder="Limit" className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                            </div>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => addQ(sIdx, gIdx)}
                        className="w-full py-1.5 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-primary hover:text-primary transition-colors">
                        + Add Question
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add group row */}
                <div className="flex gap-2">
                  <SortDropdown
                    options={GROUP_TYPE_OPTIONS}
                    value={newGroupType[sIdx] ?? 'form-completion'}
                    onChange={(v) => setNewGroupType((prev) => ({ ...prev, [sIdx]: v as ListeningGroupType }))}
                  />
                  <button
                    type="button"
                    onClick={() => addGroup(sIdx, newGroupType[sIdx] ?? 'form-completion')}
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
