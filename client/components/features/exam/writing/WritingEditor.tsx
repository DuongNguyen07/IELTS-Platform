'use client';

interface Props {
  taskNumber: number;
  minWords: number;
  value: string;
  onChange: (value: string) => void;
}

function countWords(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

export default function WritingEditor({ taskNumber, minWords, value, onChange }: Props) {
  const wc = countWords(value);
  const ok = wc >= minWords;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white">
      <div className="px-6 pt-5 pb-3 border-b border-gray-100">
        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">
          Task {taskNumber} — Your Answer
        </p>
      </div>

      <textarea
        className="flex-1 w-full px-6 py-4 font-serif text-base leading-relaxed text-slate-800 resize-none focus:outline-none placeholder:text-slate-300 bg-white"
        placeholder="Begin writing your answer here…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />

      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50 flex-shrink-0">
        <span className="text-xs text-slate-400">
          Minimum: <span className="font-semibold">{minWords} words</span>
        </span>
        <div className="flex items-center gap-2">
          {!ok && wc > 0 && (
            <span className="text-xs text-amber-500">{minWords - wc} more to go</span>
          )}
          <span className={`text-sm font-bold tabular-nums px-2.5 py-0.5 rounded-full transition-colors ${
            ok
              ? 'bg-success/10 text-success'
              : wc > 0
              ? 'bg-amber-50 text-amber-500'
              : 'bg-gray-100 text-gray-400'
          }`}>
            {wc} word{wc !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
