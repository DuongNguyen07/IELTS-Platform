'use client';

import { useState } from 'react';
import SortDropdown from '@/components/ui/SortDropdown';

const TASK_TYPE_OPTIONS = [
  { value: 'academic', label: 'Academic' },
  { value: 'general',  label: 'General Training' },
];

const VISUAL_TYPE_OPTIONS = [
  { value: '',           label: 'None (essay / no visual)' },
  { value: 'line_graph', label: 'Line Graph' },
  { value: 'bar_chart',  label: 'Bar Chart' },
  { value: 'pie_chart',  label: 'Pie Chart' },
  { value: 'table',      label: 'Table' },
  { value: 'mixed',      label: 'Mixed Charts' },
  { value: 'map',        label: 'Map' },
  { value: 'process',    label: 'Process Diagram' },
];

interface TaskDraft {
  taskType: 'academic' | 'general';
  title: string;
  prompt: string;
  minWords: number;
  timeRecommendedMins: number;
  visualType: string;
  visualUrl: string;
}

interface Props {
  onChange: (data: object) => void;
}

const DEFAULTS: [TaskDraft, TaskDraft] = [
  { taskType: 'academic', title: '', prompt: '', minWords: 150, timeRecommendedMins: 20, visualType: '', visualUrl: '' },
  { taskType: 'academic', title: '', prompt: '', minWords: 250, timeRecommendedMins: 40, visualType: '', visualUrl: '' },
];

export default function WritingBuilder({ onChange }: Props) {
  const [tasks, setTasks] = useState<[TaskDraft, TaskDraft]>([{ ...DEFAULTS[0] }, { ...DEFAULTS[1] }]);

  function update(idx: 0 | 1, patch: Partial<TaskDraft>) {
    const next: [TaskDraft, TaskDraft] = [{ ...tasks[0] }, { ...tasks[1] }];
    next[idx] = { ...next[idx], ...patch };
    setTasks(next);
    onChange(build(next));
  }

  function build(t: [TaskDraft, TaskDraft]) {
    return {
      durationMins: 60,
      tasks: t.map((task, i) => ({
        taskNumber: i + 1,
        taskType: task.taskType,
        title: task.title,
        prompt: task.prompt,
        minWords: task.minWords,
        timeRecommendedMins: task.timeRecommendedMins,
        visualType: task.visualType || null,
        visualUrl: task.visualUrl || null,
      })),
    };
  }

  return (
    <div className="space-y-5">
      {([0, 1] as const).map((idx) => {
        const task = tasks[idx];
        return (
          <div key={idx} className="border border-gray-200 rounded-xl p-5 space-y-4 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                Task {idx + 1}
              </span>
              <span className="text-xs text-slate-400">
                {idx === 0 ? 'Min 150 words · 20 mins recommended' : 'Min 250 words · 40 mins recommended'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Task Type</label>
                <SortDropdown
                  options={TASK_TYPE_OPTIONS}
                  value={task.taskType}
                  onChange={(v) => update(idx, { taskType: v as 'academic' | 'general' })}
                />
              </div>

              {idx === 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Visual Type</label>
                  <SortDropdown
                    options={VISUAL_TYPE_OPTIONS}
                    value={task.visualType}
                    onChange={(v) => update(idx, { visualType: v })}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Task Title</label>
              <input
                type="text"
                value={task.title}
                onChange={(e) => update(idx, { title: e.target.value })}
                placeholder={idx === 0 ? 'e.g. Task 1 — Bar Chart' : 'e.g. Task 2 — Discussion Essay'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Task Prompt</label>
              <textarea
                value={task.prompt}
                onChange={(e) => update(idx, { prompt: e.target.value })}
                rows={4}
                placeholder={
                  idx === 0
                    ? 'The chart below shows… Summarise the information by selecting and reporting the main features…'
                    : 'Some people believe that… To what extent do you agree or disagree?'
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {idx === 0 && task.visualType && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Chart / Image URL</label>
                <input
                  type="text"
                  value={task.visualUrl}
                  onChange={(e) => update(idx, { visualUrl: e.target.value })}
                  placeholder="/images/wt-001/task1-chart.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Upload the image to <code className="bg-gray-100 px-1 rounded">public/images/[slug]/</code> first.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Minimum Words</label>
                <input
                  type="number"
                  value={task.minWords}
                  onChange={(e) => update(idx, { minWords: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Recommended Time (mins)</label>
                <input
                  type="number"
                  value={task.timeRecommendedMins}
                  onChange={(e) => update(idx, { timeRecommendedMins: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
