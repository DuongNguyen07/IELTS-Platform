'use client';

import { useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';

interface Props {
  examTitle: string;
  partNumber: number;
  questionIndex: number;
  totalQuestions: number;
}

export default function SpeakingHeader({ examTitle, partNumber, questionIndex, totalQuestions }: Props) {
  const router = useRouter();

  return (
    <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between flex-shrink-0 z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/exam-library')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Exit exam"
        >
          <CloseIcon className="text-gray-600" style={{ fontSize: 20 }} />
        </button>
        <h1 className="text-base font-semibold text-slate-700 truncate max-w-xs">{examTitle}</h1>
      </div>

      <div className="flex items-center bg-primary/10 text-primary px-4 py-1.5 rounded-full">
        <span className="font-semibold text-sm">
          Part {partNumber} &middot; Question {questionIndex + 1} of {totalQuestions}
        </span>
      </div>

      <div className="flex items-center">
        <button className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium transition-colors">
          <SettingsIcon style={{ fontSize: 16 }} />
          Settings
        </button>
      </div>
    </header>
  );
}
