'use client';

import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface Props {
  title: string;
  slug: string;
  skill: string;
  difficulty: string;
  isPublished: boolean;
  data: Record<string, unknown>;
  saving: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

// ── Skill-specific previews ────────────────────────────────────────────────────

function WritingPreview({ data }: { data: Record<string, unknown> }) {
  const tasks = (data.tasks as Record<string, unknown>[]) ?? [];
  return (
    <div className="grid grid-cols-2 gap-4">
      {tasks.map((task, i) => (
        <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Task {i + 1}</span>
            <span className="text-xs text-slate-500 capitalize">{task.taskType as string}</span>
            {task.visualType && (
              <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full capitalize">{(task.visualType as string).replace('_', ' ')}</span>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-800">{task.title as string}</p>
          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{task.prompt as string}</p>
          <p className="text-xs font-medium text-slate-600">Min {task.minWords as number} words · {task.timeRecommendedMins as number} mins</p>
          {task.visualUrl && (
            <p className="text-xs font-mono text-blue-500 truncate">{task.visualUrl as string}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function SpeakingPreview({ data }: { data: Record<string, unknown> }) {
  const parts = (data.parts as Record<string, unknown>[]) ?? [];
  const TIME_LABELS: Record<number, string> = { 1: '30s/Q', 2: '60s prep + 2 min', 3: '45s/Q' };
  return (
    <div className="space-y-3">
      {parts.map((part, i) => {
        const questions = (part.questions as Record<string, unknown>[]) ?? [];
        return (
          <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Part {part.partNumber as number}</span>
              <span className="text-sm font-semibold text-slate-700">{part.title as string}</span>
              <span className="ml-auto text-xs text-slate-400">{questions.length} question{questions.length !== 1 ? 's' : ''} · {TIME_LABELS[part.partNumber as number]}</span>
            </div>
            <ul className="space-y-1">
              {questions.slice(0, 3).map((q, qi) => (
                <li key={qi} className="text-xs text-slate-600 truncate">
                  <span className="text-slate-400 mr-1">Q{qi + 1}</span>{q.text as string}
                </li>
              ))}
              {questions.length > 3 && <li className="text-xs text-slate-400">+{questions.length - 3} more…</li>}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function ReadingPreview({ data }: { data: Record<string, unknown> }) {
  const parts = (data.parts as Record<string, unknown>[]) ?? [];
  return (
    <div className="space-y-3">
      {parts.map((part, i) => {
        const passage = part.passage as Record<string, unknown>;
        const groups = (part.questionGroups as Record<string, unknown>[]) ?? [];
        const totalQ = groups.reduce((s, g) => s + ((g.questions as unknown[])?.length ?? 0), 0);
        return (
          <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Part {i + 1}</span>
              <span className="text-sm font-semibold text-slate-700 truncate">{passage?.title as string || '(No passage title)'}</span>
              <span className="ml-auto text-xs text-slate-400">{totalQ} questions</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {groups.map((g, gi) => (
                <span key={gi} className="text-xs bg-white border border-gray-200 rounded px-2 py-0.5 text-slate-600">
                  {(g.type as string).replace(/-/g, ' ')} ({(g.questions as unknown[])?.length ?? 0})
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ListeningPreview({ data }: { data: Record<string, unknown> }) {
  const sections = (data.sections as Record<string, unknown>[]) ?? [];
  return (
    <div className="space-y-3">
      {sections.map((section, i) => {
        const groups = (section.questionGroups as Record<string, unknown>[]) ?? [];
        const totalQ = groups.reduce((s, g) => s + ((g.questions as unknown[])?.length ?? 0), 0);
        return (
          <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Section {i + 1}</span>
              {section.audioUrl
                ? <span className="text-xs font-mono text-blue-500 truncate">{section.audioUrl as string}</span>
                : <span className="text-xs text-slate-400 italic">No audio linked</span>}
              <span className="ml-auto text-xs text-slate-400">{totalQ} questions</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {groups.map((g, gi) => (
                <span key={gi} className="text-xs bg-white border border-gray-200 rounded px-2 py-0.5 text-slate-600">
                  {(g.type as string).replace(/-/g, ' ')} ({(g.questions as unknown[])?.length ?? 0})
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

export default function ExamPreviewModal({
  title, slug, skill, difficulty, isPublished, data, saving, onConfirm, onClose,
}: Props) {
  const totalQuestions =
    skill === 'reading'   ? (data.totalQuestions as number ?? 0) :
    skill === 'listening' ? (data.totalQuestions as number ?? 0) :
    skill === 'writing'   ? (data.tasks as unknown[])?.length ?? 0 :
    skill === 'speaking'  ? (data.parts as Record<string, unknown>[])?.reduce((s, p) => s + ((p.questions as unknown[])?.length ?? 0), 0) ?? 0 : 0;

  const durationMins = (data.durationMins as number) ?? null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircleOutlineIcon className="text-success" style={{ fontSize: 20 }} />
            <h2 className="text-base font-bold text-gray-900">Exam Preview</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <CloseIcon style={{ fontSize: 20 }} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Meta summary */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-slate-800">{title}</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize font-semibold">{skill}</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize">{difficulty}</span>
            <span className="text-xs font-mono text-slate-400">/{slug}</span>
            {durationMins ? <span className="text-xs text-slate-400">{durationMins} mins</span> : null}
            <span className="text-xs text-slate-400">{totalQuestions} {skill === 'writing' ? 'task' : 'question'}{totalQuestions !== 1 ? 's' : ''}</span>
            {isPublished
              ? <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">Published</span>
              : <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">Draft</span>
            }
          </div>

          <div className="border-t border-gray-100" />

          {/* Skill-specific preview */}
          {skill === 'writing'   && <WritingPreview   data={data} />}
          {skill === 'speaking'  && <SpeakingPreview  data={data} />}
          {skill === 'reading'   && <ReadingPreview   data={data} />}
          {skill === 'listening' && <ListeningPreview data={data} />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Back to editing
          </button>
          <button
            onClick={onConfirm}
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Confirm & Save →'}
          </button>
        </div>
      </div>
    </div>
  );
}
