'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExamUploadSchema, SkillEnum, DifficultyEnum } from '@/shared/validation/examSchema';
import SortDropdown      from '@/components/ui/SortDropdown';
import WritingBuilder    from './exam-builder/WritingBuilder';
import SpeakingBuilder   from './exam-builder/SpeakingBuilder';
import ReadingBuilder    from './exam-builder/ReadingBuilder';
import ListeningBuilder  from './exam-builder/ListeningBuilder';
import ExamPreviewModal  from './exam-builder/ExamPreviewModal';

type Skill      = 'reading' | 'listening' | 'writing' | 'speaking';
type Difficulty = 'easy' | 'intermediate' | 'advanced';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const SKILL_OPTIONS      = SkillEnum.options.map((v) => ({ value: v, label: capitalize(v) }));
const DIFFICULTY_OPTIONS = DifficultyEnum.options.map((v) => ({ value: v, label: capitalize(v) }));

export default function ExamUploadForm() {
  const router = useRouter();

  // ── Metadata ──────────────────────────────────────────────────────────────
  const [slug,        setSlug]        = useState('');
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [skill,       setSkill]       = useState<Skill>('reading');
  const [difficulty,  setDifficulty]  = useState<Difficulty>('intermediate');
  const [isPublished, setIsPublished] = useState(false);

  // ── Builder data ──────────────────────────────────────────────────────────
  const [builderData, setBuilderData] = useState<object | null>(null);

  // ── Preview / save state ──────────────────────────────────────────────────
  const [showPreview,   setShowPreview]   = useState(false);
  const [errors,        setErrors]        = useState<string[]>([]);
  const [saving,        setSaving]        = useState(false);
  const [saveError,     setSaveError]     = useState<string | null>(null);

  function handleSkillChange(v: string) {
    setSkill(v as Skill);
    setBuilderData(null);
    setErrors([]);
  }

  function assembleData() {
    return { title, description: description || undefined, ...builderData };
  }

  function handlePreview() {
    setErrors([]);
    const result = ExamUploadSchema.safeParse({
      slug: slug.trim() || 'placeholder',
      skill,
      difficulty,
      isPublished,
      data: assembleData(),
    });
    if (!result.success) {
      setErrors(result.error.issues.map((i) => `${i.path.join('.') || 'root'} — ${i.message}`));
      return;
    }
    if (!slug.trim()) { setErrors(['Slug is required']); return; }
    setShowPreview(true);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/admin/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: slug.trim(), skill, difficulty, isPublished, data: assembleData() }),
      });
      const json = await res.json();
      if (!res.ok) { setSaveError(json.error ?? 'Save failed'); return; }
      router.push('/admin/exams');
      router.refresh();
    } catch {
      setSaveError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const builderProps = { onChange: (data: object) => { setBuilderData(data); setErrors([]); } };
  const canPreview = !!builderData && !!title.trim() && !!slug.trim();

  return (
    <>
      <div className="space-y-6">

        {/* ── Metadata ─────────────────────────────────────────────────────── */}
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
                placeholder="e.g. rt-002"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <p className="text-xs text-gray-400 mt-1">URL: /exam/{slug || 'slug'}/{skill}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Skill</label>
              <SortDropdown options={SKILL_OPTIONS} value={skill} onChange={handleSkillChange} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Exam Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`e.g. IELTS ${capitalize(skill)} Practice Test 1`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Difficulty</label>
              <SortDropdown options={DIFFICULTY_OPTIONS} value={difficulty} onChange={(v) => setDifficulty(v as Difficulty)} />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Description (optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description shown in the exam library…"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input type="checkbox" id="isPublished" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 accent-primary" />
              <label htmlFor="isPublished" className="text-sm text-gray-700 cursor-pointer">Publish immediately</label>
            </div>
          </div>
        </section>

        {/* ── Skill-specific builder ────────────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">{capitalize(skill)} Exam Builder</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {skill === 'reading'   && 'Fill in 3 passages and add question groups to each part.'}
                {skill === 'listening' && 'Add question groups to each of the 4 sections and link audio files.'}
                {skill === 'writing'   && 'Fill in the two writing tasks. Upload chart/image separately to public/images/.'}
                {skill === 'speaking'  && 'Add questions to each part. Part 2 supports cue card bullet points.'}
              </p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium capitalize">{skill}</span>
          </div>

          {skill === 'writing'   && <WritingBuilder   {...builderProps} />}
          {skill === 'speaking'  && <SpeakingBuilder  {...builderProps} />}
          {skill === 'reading'   && <ReadingBuilder   {...builderProps} />}
          {skill === 'listening' && <ListeningBuilder {...builderProps} />}
        </section>

        {/* ── Errors ───────────────────────────────────────────────────────── */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-700 mb-2">Please fix the following before continuing:</p>
            <ul className="space-y-1">
              {errors.map((msg, i) => (
                <li key={i} className="text-xs text-red-600 font-mono">• {msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Action ───────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePreview}
            disabled={!canPreview}
            className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Preview & Save →
          </button>
          {!canPreview && (
            <p className="text-xs text-slate-400">Fill in slug, title and at least one exam section to continue.</p>
          )}
          {saveError && <p className="text-sm text-red-600">{saveError}</p>}
        </div>
      </div>

      {/* ── Preview modal ─────────────────────────────────────────────────── */}
      {showPreview && (
        <ExamPreviewModal
          title={title}
          slug={slug}
          skill={skill}
          difficulty={difficulty}
          isPublished={isPublished}
          data={assembleData() as Record<string, unknown>}
          saving={saving}
          onConfirm={handleSave}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
