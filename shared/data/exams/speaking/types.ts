// ── Question ──────────────────────────────────────────────────────────────────

export interface SpeakingQuestion {
  questionNumber: number;
  text: string;
  bulletPoints?: string[]; // Part 2 cue card bullet points
  timeLimitSecs: number;   // Part 1: 30, Part 2: 120, Part 3: 45
  prepTimeSecs?: number;   // Part 2 only: 60
}

// ── Part ──────────────────────────────────────────────────────────────────────

export interface SpeakingPart {
  partNumber: 1 | 2 | 3;
  title: string;
  description?: string;
  questions: SpeakingQuestion[];
}

// ── Exam ──────────────────────────────────────────────────────────────────────

export interface SpeakingExam {
  id: string;
  title: string;
  description?: string;
  parts: [SpeakingPart, SpeakingPart, SpeakingPart];
}
