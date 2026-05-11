export type MaterialCategory = 'ebooks' | 'vocabulary' | 'grammar' | 'video';
export type MaterialFormat = 'PDF' | 'XLSX' | 'VIDEO' | 'DOCX';
export type MaterialLevel = 'beginner' | 'intermediate' | 'advanced';
export type MaterialSkill = 'writing' | 'vocabulary' | 'speaking' | 'grammar' | 'listening' | 'reading';
export type ActionType = 'download' | 'watch' | 'view';

export interface MaterialItem {
  id: number;
  title: string;
  description: string;
  skill: MaterialSkill;
  category: MaterialCategory;
  format: MaterialFormat;
  fileSize: string; // e.g. '4.2 MB' or '18 MIN'
  level: MaterialLevel;
  rating: number; // 0–5, supports .5
  actionType: ActionType;
}
