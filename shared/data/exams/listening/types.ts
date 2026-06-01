// ── Question types ────────────────────────────────────────────────────────────

export type ListeningQuestionType =
  | 'multiple-choice'
  | 'multiple-choice-many'
  | 'matching'
  | 'plan-map-diagram'
  | 'form-completion'
  | 'note-completion'
  | 'table-completion'
  | 'flow-chart-completion'
  | 'summary-completion'
  | 'sentence-completion'
  | 'short-answer';

// ── Question interfaces ───────────────────────────────────────────────────────

export interface MultipleChoiceQuestion {
  type: 'multiple-choice';
  number: number;
  text: string;
  options: { letter: string; text: string }[];
  answer: string;
}

export interface MultipleChoiceManyQuestion {
  type: 'multiple-choice-many';
  number: number;
  text: string;
  options: { letter: string; text: string }[];
  chooseCount: number;
  answers: string[];
}

export interface MatchingQuestion {
  type: 'matching';
  number: number;
  text: string;
  answer: string;
}

export interface PlanMapDiagramQuestion {
  type: 'plan-map-diagram';
  number: number;
  locationLabel: string;
  answer: string;
  wordLimit?: number;
}

export interface FormCompletionQuestion {
  type: 'form-completion';
  number: number;
  fieldLabel: string;
  answer: string;
  wordLimit?: number;
}

export interface NoteCompletionQuestion {
  type: 'note-completion';
  number: number;
  beforeBlank?: string;
  afterBlank?: string;
  answer: string;
  wordLimit?: number;
}

export interface TableCompletionQuestion {
  type: 'table-completion';
  number: number;
  rowLabel?: string;
  columnLabel?: string;
  beforeBlank?: string;
  afterBlank?: string;
  answer: string;
  wordLimit?: number;
}

export interface FlowChartCompletionQuestion {
  type: 'flow-chart-completion';
  number: number;
  beforeBlank?: string;
  afterBlank?: string;
  answer: string;
  wordLimit?: number;
}

export interface SummaryCompletionQuestion {
  type: 'summary-completion';
  number: number;
  beforeBlank?: string;
  afterBlank?: string;
  answer: string;
  wordLimit?: number;
}

export interface SentenceCompletionQuestion {
  type: 'sentence-completion';
  number: number;
  beforeBlank: string;
  afterBlank?: string;
  answer: string;
  wordLimit?: number;
}

export interface ShortAnswerQuestion {
  type: 'short-answer';
  number: number;
  text: string;
  answer: string;
  wordLimit?: number;
}

export type ListeningQuestion =
  | MultipleChoiceQuestion
  | MultipleChoiceManyQuestion
  | MatchingQuestion
  | PlanMapDiagramQuestion
  | FormCompletionQuestion
  | NoteCompletionQuestion
  | TableCompletionQuestion
  | FlowChartCompletionQuestion
  | SummaryCompletionQuestion
  | SentenceCompletionQuestion
  | ShortAnswerQuestion;

// ── Question groups ───────────────────────────────────────────────────────────

interface BaseGroup {
  instruction: string;
  questionRange: { from: number; to: number };
}

export interface StandardGroup extends BaseGroup {
  type: 'multiple-choice' | 'multiple-choice-many' | 'short-answer';
  questions: ListeningQuestion[];
}

export interface SentenceCompletionGroup extends BaseGroup {
  type: 'sentence-completion';
  questions: SentenceCompletionQuestion[];
}

export interface MatchingGroup extends BaseGroup {
  type: 'matching';
  options: { letter: string; text: string }[];
  questions: MatchingQuestion[];
}

export interface PlanMapDiagramGroup extends BaseGroup {
  type: 'plan-map-diagram';
  imageUrl?: string;
  imageDescription?: string;
  questions: PlanMapDiagramQuestion[];
}

export interface FormCompletionGroup extends BaseGroup {
  type: 'form-completion';
  formTitle?: string;
  questions: FormCompletionQuestion[];
}

export interface NoteCompletionGroup extends BaseGroup {
  type: 'note-completion';
  notesTitle?: string;
  questions: NoteCompletionQuestion[];
}

export interface TableCompletionGroup extends BaseGroup {
  type: 'table-completion';
  tableTitle?: string;
  columnHeaders?: string[];
  questions: TableCompletionQuestion[];
}

export interface FlowChartCompletionGroup extends BaseGroup {
  type: 'flow-chart-completion';
  chartTitle?: string;
  questions: FlowChartCompletionQuestion[];
}

export interface SummaryCompletionGroup extends BaseGroup {
  type: 'summary-completion';
  summaryTitle?: string;
  questions: SummaryCompletionQuestion[];
}

export type ListeningQuestionGroup =
  | StandardGroup
  | MatchingGroup
  | PlanMapDiagramGroup
  | FormCompletionGroup
  | NoteCompletionGroup
  | TableCompletionGroup
  | FlowChartCompletionGroup
  | SummaryCompletionGroup
  | SentenceCompletionGroup;

// ── Section & Exam ────────────────────────────────────────────────────────────

export interface ListeningSection {
  sectionNumber: 1 | 2 | 3 | 4;
  audioUrl?: string;
  questionGroups: ListeningQuestionGroup[];
  questionRange: { from: number; to: number };
}

export interface ListeningExam {
  id: string;
  title: string;
  description?: string;
  durationMins: number;
  sections: [ListeningSection, ListeningSection, ListeningSection, ListeningSection];
  totalQuestions: number;
}
