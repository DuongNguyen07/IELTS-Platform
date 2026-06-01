export type WritingVisualType =
  | 'line_graph'
  | 'bar_chart'
  | 'pie_chart'
  | 'table'
  | 'mixed'
  | 'map'
  | 'process';

export interface WritingTask {
  taskNumber: 1 | 2;
  taskType: 'academic' | 'general';
  title: string;
  prompt: string;
  minWords: number;
  timeRecommendedMins: number;
  visualType?: WritingVisualType;
  visualUrl?: string;
}

export interface WritingExam {
  id: string;
  title: string;
  description?: string;
  durationMins: number;
  tasks: [WritingTask, WritingTask];
}
