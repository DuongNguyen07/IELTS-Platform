import type { ExamTest } from '@/shared/constants';
import type { TestPart } from './types';

export const ALL_PARTS: TestPart[] = [
  {
    id: 'listening',
    title: 'Part 1: Listening',
    subtitle: '40 questions • Sections 1–4',
    duration: 30,
    checked: true,
    enabled: true,
  },
  {
    id: 'reading',
    title: 'Part 2: Reading',
    subtitle: '40 questions • 3 Passages',
    duration: 60,
    checked: true,
    enabled: true,
  },
  {
    id: 'writing',
    title: 'Part 3: Writing',
    subtitle: '2 tasks • Academic context',
    duration: 60,
    checked: true,
    enabled: true,
  },
  {
    id: 'speaking',
    title: 'Part 4: Speaking',
    subtitle: '3 parts • Interactive',
    duration: 15,
    checked: true,
    enabled: true,
  },
];


type PartTemplate = Omit<TestPart, 'checked' | 'enabled'>;

export const SKILL_SUB_PARTS: Record<string, PartTemplate[]> = {
  listening: [
    { id: 'listening-s1', title: 'Section 1', subtitle: '10 questions', duration: 8 },
    { id: 'listening-s2', title: 'Section 2', subtitle: '10 questions', duration: 8 },
    { id: 'listening-s3', title: 'Section 3', subtitle: '10 questions', duration: 7 },
    { id: 'listening-s4', title: 'Section 4', subtitle: '10 questions', duration: 7 },
  ],
  reading: [
    { id: 'reading-p1', title: 'Passage 1', subtitle: '13 questions', duration: 20 },
    { id: 'reading-p2', title: 'Passage 2', subtitle: '13 questions', duration: 20 },
    { id: 'reading-p3', title: 'Passage 3', subtitle: '14 questions', duration: 20 },
  ],
  writing: [
    { id: 'writing-t1', title: 'Task 1', subtitle: 'Describe a graph, chart or diagram', duration: 20 },
    { id: 'writing-t2', title: 'Task 2', subtitle: 'Respond to an argument or problem',  duration: 40 },
  ],
  speaking: [
    { id: 'speaking-p1', title: 'Part 1', subtitle: 'Introduction & interview', duration: 5 },
    { id: 'speaking-p2', title: 'Part 2', subtitle: 'Individual long turn',     duration: 4 },
    { id: 'speaking-p3', title: 'Part 3', subtitle: 'Two-way discussion',       duration: 6 },
  ],
};


export const QUESTIONS_LABEL: Record<string, string> = {
  listening: '40',
  reading: '40',
  writing: '2 parts',
  speaking: '3 parts',
  general: '120+',
};

export const LEVEL_LABEL: Record<string, string> = {
  easy: 'Foundation',
  intermediate: 'Academic',
  advanced: 'Advanced',
};


export function buildInitialParts(test: ExamTest): TestPart[] {
  if (test.type === 'general') return ALL_PARTS;

  const subParts = SKILL_SUB_PARTS[test.type];
  if (!subParts) return [];

  return subParts.map((p) => ({ ...p, checked: true, enabled: true }));
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
