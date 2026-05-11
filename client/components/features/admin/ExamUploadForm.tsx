'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ExamUploadSchema, SkillEnum, DifficultyEnum } from '@/shared/validation/examSchema';
import SortDropdown from '@/components/ui/SortDropdown';

type ValidationState = 'idle' | 'valid' | 'error';

interface ExamPreview {
  title: string;
  totalQuestions: number;
  durationMins: number;
  parts: number;
}

export default function ExamUploadForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [slug, setSlug] = useState('');
  const [skill, setSkill] = useState<'reading' | 'listening' | 'writing' | 'speaking'>('reading');
  const [difficulty, setDifficulty] = useState<'easy' | 'intermediate' | 'advanced'>('intermediate');
  const [isPublished, setIsPublished] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [validationState, setValidationState] = useState<ValidationState>('idle');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState<ExamPreview | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setJsonText(ev.target?.result as string);
      setValidationState('idle');
      setPreview(null);
    };
    reader.readAsText(file);
  };

  const validate = () => {
    setValidationErrors([]);
    setPreview(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setValidationState('error');
      setValidationErrors(['Invalid JSON — check for syntax errors (missing commas, brackets, etc.)']);
      return;
    }

    const result = ExamUploadSchema.safeParse({
      slug: slug || 'placeholder',
      skill,
      difficulty,
      isPublished,
      data: parsed,
    });

    if (!result.success) {
      const messages = result.error.issues.map(
        (issue) => `${issue.path.join('.') || 'root'} — ${issue.message}`
      );
      setValidationState('error');
      setValidationErrors(messages);
      return;
    }

    setValidationState('valid');
    setPreview({
      title: result.data.data.title,
      totalQuestions: result.data.data.totalQuestions,
      durationMins: result.data.data.durationMins,
      parts: result.data.data.parts.length,
    });
  };

  const handleSave = async () => {
    if (validationState !== 'valid' || !slug.trim()) return;
    setSaving(true);
    setSaveError(null);

    try {
      const res = await fetch('/api/admin/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: slug.trim(),
          skill,
          difficulty,
          isPublished,
          data: JSON.parse(jsonText),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setSaveError(json.error ?? 'Save failed');
        return;
      }
      router.push('/admin/exams');
      router.refresh();
    } catch {
      setSaveError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Exam Metadata</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Slug <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="e.g. rt-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <p className="text-xs text-gray-400 mt-1">Used in the URL: /exam/rt-001/reading</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5  tracking-wide">
              SKILL
            </label>
            <SortDropdown
              options={SKILL_OPTIONS}
              value={skill}
              onChange={(v) => setSkill(v as typeof skill)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide">
              DIFFICULTY
            </label>
            <SortDropdown
              options={DIFFICULTY_OPTIONS}
              value={difficulty}
              onChange={(v) => setDifficulty(v as typeof difficulty)}
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="isPublished" className="text-sm text-gray-700 cursor-pointer">
              Publish immediately
            </label>
          </div>
        </div>
      </section>

      {/* JSON upload */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Exam JSON</h2>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
          >
            Upload .json file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        <textarea
          value={jsonText}
          onChange={(e) => { setJsonText(e.target.value); setValidationState('idle'); setPreview(null); }}
          rows={18}
          placeholder={JSON_PLACEHOLDER}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg text-xs font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
          spellCheck={false}
        />

        {/* Validation result */}
        {validationState === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-red-700 mb-2">Validation errors</p>
            <ul className="space-y-1">
              {validationErrors.map((msg, i) => (
                <li key={i} className="text-xs text-red-600 font-mono">• {msg}</li>
              ))}
            </ul>
          </div>
        )}

        {validationState === 'valid' && preview && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800">✓ Valid exam structure</p>
              <p className="text-sm text-green-700 mt-1">{preview.title}</p>
              <p className="text-xs text-green-600 mt-0.5">
                {preview.parts} parts · {preview.totalQuestions} questions · {preview.durationMins} minutes
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={validate}
            disabled={!jsonText.trim()}
            className="px-5 py-2.5 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Validate JSON
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={validationState !== 'valid' || !slug.trim() || saving}
            className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Save Exam'}
          </button>
        </div>

        {saveError && (
          <p className="text-sm text-red-600">{saveError}</p>
        )}
      </section>

      {/* Format reference */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-3">Supported Question Types</h2>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 font-serif">
          {QUESTION_TYPES.map((t) => (
            <div key={t.type} className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <div>
                <span className="font-semibold text-gray-800">{t.type}</span>
                <span className="text-gray-500 ml-1">— {t.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const SKILL_OPTIONS = SkillEnum.options.map((v) => ({ value: v, label: capitalize(v) }));
const DIFFICULTY_OPTIONS = DifficultyEnum.options.map((v) => ({ value: v, label: capitalize(v) }));

const QUESTION_TYPES = [
  { type: 'Multiple-choice', desc: 'A/B/C/D radio options per question' },
  { type: 'True-False-Not Given', desc: 'TRUE / FALSE / NOT GIVEN' },
  { type: 'Yes-No-Not Given', desc: 'YES / NO / NOT GIVEN' },
  { type: 'Matching Headings', desc: 'Match paragraphs to headings' },
  { type: 'Matching Features/Sentence Endings', desc: 'Match features/sentence endings' },
  { type: 'Sentence Completion', desc: 'Fill in blank within a sentence' },
  { type: 'Diagram Label Completion', desc: 'Label parts of a diagram' },
  { type: 'Short Answer', desc: 'Open text, word limit' },
];

const JSON_PLACEHOLDER = `{
  "title": "IELTS Academic Reading Test 2",
  "description": "Optional description",
  "durationMins": 60,
  "totalQuestions": 40,
  "parts": [
    {
      "partNumber": 1,
      "questionRange": { "from": 1, "to": 13 },
      "passage": {
        "title": "Passage Title",
        "paragraphs": [{ "text": "Paragraph text..." }]
      },
      "questionGroups": [
        {
          "type": "true-false-not-given",
          "instruction": "Do the following statements agree...",
          "questionRange": { "from": 1, "to": 7 },
          "questions": [
            { "type": "true-false-not-given", "number": 1, "text": "Statement...", "answer": "TRUE" }
          ]
        }
      ]
    }
  ]
}`;
