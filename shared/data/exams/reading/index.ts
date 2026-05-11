import type { ReadingExam } from './types';
import rt001 from './rt-001';

export const READING_EXAMS: Record<string, ReadingExam> = {
  'rt-001': rt001,
};

export const EXAM_ID_TO_READING_SLUG: Record<number, string> = {
  1: 'rt-001',
  2: 'rt-001',
  3: 'rt-001',
};

export function getReadingExam(id: string | number): ReadingExam | null {
  const slug = typeof id === 'number' ? EXAM_ID_TO_READING_SLUG[id] : id;
  return slug ? (READING_EXAMS[slug] ?? null) : null;
}

export type { ReadingExam } from './types';
