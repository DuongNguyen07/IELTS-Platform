import type { WritingTask } from '@/shared/data/exams/writing/types';

const VISUAL_LABELS: Record<string, string> = {
  line_graph: 'Line Graph',
  bar_chart: 'Bar Chart',
  pie_chart: 'Pie Chart',
  table: 'Table',
  mixed: 'Mixed Charts',
  map: 'Map',
  process: 'Process Diagram',
};

interface Props {
  task: WritingTask;
  style?: React.CSSProperties;
}

export default function WritingTaskPanel({ task, style }: Props) {
  return (
    <div
      className="overflow-y-auto bg-exam-bg border-r border-gray-200 min-w-0"
      style={{ ...style, scrollbarWidth: 'thin' }}
    >
      <div className="max-w-2xl mx-auto px-8 py-8 space-y-5">

        {/* Task prompt card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              Task {task.taskNumber}
            </span>
            {task.visualType && (
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {VISUAL_LABELS[task.visualType]}
              </span>
            )}
            <span className="ml-auto text-xs text-slate-400 italic">{task.taskType}</span>
          </div>

          <h2 className="text-sm font-semibold text-slate-800 mb-3">{task.title}</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{task.prompt}</p>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-xs text-slate-500">
            <span>
              Write at least{' '}
              <span className="font-semibold text-slate-700">{task.minWords} words</span>
            </span>
            <span className="text-gray-300">|</span>
            <span>
              Recommended:{' '}
              <span className="font-semibold text-slate-700">{task.timeRecommendedMins} mins</span>
            </span>
          </div>
        </div>

        {/* Visual image asset */}
        {task.visualUrl && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={task.visualUrl}
              alt={task.visualType ? VISUAL_LABELS[task.visualType] : 'Task visual'}
              className="w-full object-contain max-h-80 rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
