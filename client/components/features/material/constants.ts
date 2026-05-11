import type { MaterialItem, MaterialCategory, MaterialLevel, MaterialFormat, MaterialSkill } from './types';


export interface CategoryOption {
  key: MaterialCategory | 'all';
  label: string;
  icon: string; 
}

export const CATEGORIES: { key: MaterialCategory | 'all'; label: string }[] = [
  { key: 'all',        label: 'All' },
  { key: 'ebooks',     label: 'E-books' },
  { key: 'vocabulary', label: 'Vocabulary Lists' },
  { key: 'grammar',    label: 'Grammar Guides' },
  { key: 'video',      label: 'Video Lessons' },
];

export const LEVELS: { key: MaterialLevel; label: string }[] = [
  { key: 'beginner',     label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced',     label: 'Advanced' },
];

export const FORMATS: { key: MaterialFormat; label: string }[] = [
  { key: 'PDF',   label: 'PDF Documents' },
  { key: 'VIDEO', label: 'MP4 Videos' },
  { key: 'XLSX',  label: 'Spreadsheets' },
  { key: 'DOCX',  label: 'Word Documents' },
];

export const SORT_OPTIONS = [
  { value: 'newest',   label: 'Newest' },
  { value: 'popular',  label: 'Most Popular' },
  { value: 'level',    label: 'Level (A–Z)' },
];

export interface SkillConfig {
  label: string;
  badgeBg: string;
  badgeText: string;
  cardBg: string;        
  iconColor: string;
}

export const SKILL_CONFIG: Record<MaterialSkill, SkillConfig> = {
  writing: {
    label: 'Writing Task 2',
    badgeBg: 'bg-primary/10',
    badgeText: 'text-primary',
    cardBg: 'from-blue-100 to-blue-200',
    iconColor: '#2b6cee',
  },
  vocabulary: {
    label: 'Vocabulary',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-600',
    cardBg: 'from-emerald-100 to-emerald-200',
    iconColor: '#059669',
  },
  speaking: {
    label: 'Speaking',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-600',
    cardBg: 'from-indigo-100 to-indigo-200',
    iconColor: '#4f46e5',
  },
  grammar: {
    label: 'Grammar',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-600',
    cardBg: 'from-rose-100 to-rose-200',
    iconColor: '#e11d48',
  },
  listening: {
    label: 'Listening',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-600',
    cardBg: 'from-orange-100 to-orange-200',
    iconColor: '#ea580c',
  },
  reading: {
    label: 'Reading',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    cardBg: 'from-sky-100 to-sky-200',
    iconColor: '#0369a1',
  },
};
export const SKILL_IMAGE: Record<MaterialSkill, string> = {
  writing:    '/images/material_background/mastering_academic_writing.jpg',
  vocabulary: '/images/material_background/top_500_academic_collocation.jpg',
  speaking:   '/images/exam_types/speaking_exam.jpg',
  grammar:    '/images/exam_types/general_academic_exam.jpg',
  listening:  '/images/exam_types/listening_exam.jpg',
  reading:    '/images/exam_types/reading_exam.jpg',
};

export const MATERIALS_PER_PAGE = 9;

export const MATERIAL_ITEMS: MaterialItem[] = [
  {
    id: 1,
    title: 'Mastering Academic Writing: Complex Structures',
    description: 'A comprehensive guide to using advanced grammatical structures for a Band 8+ score.',
    skill: 'writing', category: 'ebooks', format: 'PDF', fileSize: '4.2 MB',
    level: 'advanced', rating: 4.5, actionType: 'download',
  },
  {
    id: 2,
    title: 'Top 500 Academic Collocations',
    description: 'The most common word combinations found in IELTS Reading and Listening tests.',
    skill: 'vocabulary', category: 'vocabulary', format: 'XLSX', fileSize: '1.1 MB',
    level: 'intermediate', rating: 4, actionType: 'download',
  },
  {
    id: 3,
    title: 'IELTS Speaking Part 2: Masterclass',
    description: 'Learn how to speak fluently for 2 minutes without pauses using the "Storytelling" method.',
    skill: 'speaking', category: 'video', format: 'VIDEO', fileSize: '18 MIN',
    level: 'intermediate', rating: 5, actionType: 'watch',
  },
  {
    id: 4,
    title: 'Conditional Sentences for IELTS',
    description: 'Perfect your Zero, First, Second, and Third conditionals for Writing and Speaking tests.',
    skill: 'grammar', category: 'grammar', format: 'PDF', fileSize: '2.5 MB',
    level: 'beginner', rating: 4, actionType: 'download',
  },
  {
    id: 5,
    title: 'Essential Signposting Language',
    description: 'Recognize when a speaker is moving to a new point to avoid losing your place in Section 4.',
    skill: 'listening', category: 'vocabulary', format: 'DOCX', fileSize: '0.8 MB',
    level: 'advanced', rating: 5, actionType: 'view',
  },
  {
    id: 6,
    title: 'Scanning & Skimming Techniques',
    description: 'Save time on the reading test by mastering these two essential text-navigation skills.',
    skill: 'reading', category: 'ebooks', format: 'PDF', fileSize: '6.0 MB',
    level: 'beginner', rating: 4.5, actionType: 'download',
  },
  {
    id: 7,
    title: 'IELTS Task 1 — Graphs & Charts Pack',
    description: '20 annotated model answers covering line graphs, bar charts, pie charts and maps.',
    skill: 'writing', category: 'ebooks', format: 'PDF', fileSize: '3.7 MB',
    level: 'intermediate', rating: 5, actionType: 'download',
  },
  {
    id: 8,
    title: 'Academic Word List Flashcards',
    description: 'Drill the 570 most important AWL words with definitions and usage examples.',
    skill: 'vocabulary', category: 'vocabulary', format: 'XLSX', fileSize: '0.5 MB',
    level: 'beginner', rating: 4, actionType: 'download',
  },
  {
    id: 9,
    title: 'Speaking Part 1 — Sample Q&A Bank',
    description: '80 common Part 1 questions with model answers and band score commentary.',
    skill: 'speaking', category: 'ebooks', format: 'PDF', fileSize: '2.1 MB',
    level: 'beginner', rating: 4.5, actionType: 'download',
  },
  {
    id: 10,
    title: 'Passive Voice Masterclass',
    description: 'When and how to use passive constructions to boost your grammatical range score.',
    skill: 'grammar', category: 'video', format: 'VIDEO', fileSize: '24 MIN',
    level: 'intermediate', rating: 4.5, actionType: 'watch',
  },
  {
    id: 11,
    title: 'Section 4 Lecture Strategies',
    description: 'Techniques to predict, map, and capture information from academic monologues.',
    skill: 'listening', category: 'ebooks', format: 'PDF', fileSize: '1.8 MB',
    level: 'advanced', rating: 5, actionType: 'download',
  },
  {
    id: 12,
    title: 'True / False / Not Given — Solved',
    description: 'The #1 trick question type — broken down with 30 practice examples and a decision flowchart.',
    skill: 'reading', category: 'grammar', format: 'PDF', fileSize: '1.4 MB',
    level: 'intermediate', rating: 4, actionType: 'download',
  },
  {
    id: 13,
    title: 'Band 7 Writing Phrases Collection',
    description: 'Over 200 linking words, discourse markers and academic phrases for Task 2 essays.',
    skill: 'writing', category: 'vocabulary', format: 'DOCX', fileSize: '0.6 MB',
    level: 'intermediate', rating: 4.5, actionType: 'view',
  },
  {
    id: 14,
    title: 'Pronunciation for IELTS Speaking',
    description: 'Improve clarity and natural rhythm to score higher on the Pronunciation criterion.',
    skill: 'speaking', category: 'video', format: 'VIDEO', fileSize: '32 MIN',
    level: 'beginner', rating: 5, actionType: 'watch',
  },
  {
    id: 15,
    title: 'Articles, Determiners & Quantifiers',
    description: 'The complete guide to a/an/the and other common grammar pitfalls for non-native speakers.',
    skill: 'grammar', category: 'grammar', format: 'PDF', fileSize: '3.0 MB',
    level: 'beginner', rating: 3.5, actionType: 'download',
  },
];

const LEVEL_ORDER: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3 };

export function filterAndSort(
  items: MaterialItem[],
  {
    search,
    category,
    levels,
    formats,
    sort,
  }: {
    search: string;
    category: string;
    levels: Set<string>;
    formats: Set<string>;
    sort: string;
  }
): MaterialItem[] {
  let result = [...items];

  if (category !== 'all') result = result.filter((m) => m.category === category);
  if (levels.size > 0)    result = result.filter((m) => levels.has(m.level));
  if (formats.size > 0)   result = result.filter((m) => formats.has(m.format));

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    );
  }

  if (sort === 'popular') result.sort((a, b) => b.rating - a.rating);
  else if (sort === 'level') result.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);

  return result;
}
