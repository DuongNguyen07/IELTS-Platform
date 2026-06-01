'use client';

import { useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SettingsIcon from '@mui/icons-material/Settings';

interface Props {
  examTitle: string;
  timeLeft: number;
  testMode: 'timed' | 'practice';
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '∞';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return h > 0 ? `${String(h).padStart(2, '0')}:${m}:${s}` : `${m}:${s}`;
}

export default function ListeningHeader({ examTitle, timeLeft, testMode }: Props) {
  const router = useRouter();

  return (
    <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between flex-shrink-0 z-50">
      {/* Left: close + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/exam-library')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Close"
        >
          <CloseIcon className="h-4 w-4 text-gray-600" />
        </button>
        <h1 className="text-base font-semibold text-slate-700 truncate max-w-xs">{examTitle}</h1>
      </div>

      {/* Center: timer */}
      {testMode === 'timed' ? (
        <div className="flex items-center bg-red-500 text-white px-4 py-1.5 rounded-full gap-2">
          <AccessTimeIcon className="h-4 w-4" />
          <span className="font-semibold font-bold text-sm">{formatTime(timeLeft)}</span>
        </div>
      ) : (
        <span className="bg-teal/20 text-teal text-xs font-semibold px-4 py-1.5 rounded-full">
          Practice Mode
        </span>
      )}

      {/* Right: tools */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium transition-colors">
          <EditNoteIcon className="h-4 w-4" />
          View notes
        </button>
        <button className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium transition-colors">
          <SettingsIcon className="h-2 w-2" />
          Settings
        </button>
      </div>
    </header>
  );
}
