'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ExamUploadSchema, SkillEnum, DifficultyEnum } from '@/shared/validation/examSchema';
import SortDropdown from '@/components/ui/SortDropdown';

type Skill = 'reading' | 'listening' | 'writing' | 'speaking';
type Difficulty = 'easy' | 'intermediate' | 'advanced';
type ValidationState = 'idle' | 'valid' | 'error';

interface InitialData {
  id: string;
  slug: string;
  skill: Skill;
  difficulty: Difficulty;
  isPublished: boolean;
  data: object;
}

interface ExamPreview {
  title: string;
  totalQuestions: number;
  durationMins: number;
  count: number;
  countLabel: string;
}

export default function ExamEditForm({ initial }: { initial: InitialData }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [slug, setSlug] = useState(initial.slug);
  const [skill, setSkill] = useState<Skill>(initial.skill);
  const [difficulty, setDifficulty] = useState<Difficulty>(initial.difficulty);
  const [isPublished, setIsPublished] = useState(initial.isPublished);
  const [jsonText, setJsonText] = useState(JSON.stringify(initial.data, null, 2));
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

    const result = ExamUploadSchema.safeParse({ slug, skill, difficulty, isPublished, data: parsed });

    if (!result.success) {
      setValidationState('error');
      setValidationErrors(result.error.issues.map((i) => `${i.path.join('.') || 'root'} — ${i.message}`));
      return;
    }

    const data = result.data.data;
    const hasSections = 'sections' in data;
    setValidationState('valid');
    setPreview({
      title: data.title,
      totalQuestions: data.totalQuestions,
      durationMins: data.durationMins,
      count: hasSections ? (data as { sections: unknown[] }).sections.length : (data as { parts: unknown[] }).parts.length,
      countLabel: hasSections ? 'sections' : 'parts',
    });
  };

  const handleSave = async () => {
    if (validationState !== 'valid' || !slug.trim()) return;
    setSaving(true);
    setSaveError(null);

    try {
      const res = await fetch(`/api/admin/exams/${initial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: slug.trim(), difficulty, isPublished, data: JSON.parse(jsonText) }),
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide">SKILL</label>
            <SortDropdown
              options={SKILL_OPTIONS}
              value={skill}
              onChange={(v) => setSkill(v as Skill)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide">DIFFICULTY</label>
            <SortDropdown
              options={DIFFICULTY_OPTIONS}
              value={difficulty}
              onChange={(v) => setDifficulty(v as Difficulty)}
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
              Published
            </label>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Exam JSON</h2>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
          >
            Replace with .json file
          </button>
          <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleFileUpload} />
        </div>

        <textarea
          value={jsonText}
          onChange={(e) => { setJsonText(e.target.value); setValidationState('idle'); setPreview(null); }}
          rows={22}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg text-xs font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
          spellCheck={false}
        />

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
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-green-800">✓ Valid exam structure</p>
            <p className="text-sm text-green-700 mt-1">{preview.title}</p>
            <p className="text-xs text-green-600 mt-0.5">
              {preview.count} {preview.countLabel} · {preview.totalQuestions} questions · {preview.durationMins} minutes
            </p>
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
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        {saveError && <p className="text-sm text-red-600">{saveError}</p>}
      </section>
    </div>
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const SKILL_OPTIONS = SkillEnum.options.map((v) => ({ value: v, label: capitalize(v) }));
const DIFFICULTY_OPTIONS = DifficultyEnum.options.map((v) => ({ value: v, label: capitalize(v) }));
