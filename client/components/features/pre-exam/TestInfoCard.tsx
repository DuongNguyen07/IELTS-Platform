import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';

import { formatDuration, QUESTIONS_LABEL } from './constants';
import type { ExamTest } from '@/shared/constants';

interface Props {
  test: ExamTest;
}

export default function TestInfoCard({ test }: Props) {
  const isGeneral = test.type === 'general';
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
      <div className="grid grid-cols-3 gap-8">

        {/* Overview text */}
        <div className="col-span-2 flex flex-col gap-3">
          <h2 className="text-gray-900 text-lg font-bold">Test Overview</h2>
          <div className="text-gray-500 text-sm leading-relaxed flex flex-col gap-1 ">
            <p>
              This{isGeneral ? 'full' : ''} practice exam simulates the official IELTS
              Academic Test format.
            </p>
            <p className="text-green-600">
              Tip: Part-selection mode helps you focus on specific skills rather than completing the
              entire test.
            </p>
            <p className="text-red-500 font-medium">
              Notice: To receive a converted real score, please choose choose timed mode.
            </p>
          </div>
        </div>

        {/* Stats column */}
        <div className="flex flex-col gap-3">
          {/* Duration */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-blue-200 rounded-full size-10 flex items-center justify-center shrink-0">
              <AccessTimeIcon style={{ fontSize: '1.1rem', color: '#1d4ed8' }} />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Duration</p>
              <p className="text-gray-900 font-bold text-base">{formatDuration(test.durationMins)}</p>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-green-200 rounded-full size-10 flex items-center justify-center shrink-0">
              <AssignmentIcon style={{ fontSize: '1.1rem', color: '#15803d' }} />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Questions</p>
              <p className="text-gray-900 font-bold text-base">{QUESTIONS_LABEL[test.type] ?? '—'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
