//Question types
export type QuestionType =
  | 'multiple-choice'
  | 'true-false-not-given'
  | 'yes-no-not-given'
  | 'matching-headings'
  | 'matching-features-ending'
  | 'diagram-label-completion'
  | 'sentence-completion'
  | 'short-answer';

//Passage 

export interface PassageParagraph {
  // 'A', 'B', 'C',… — set only for matching-headings questions
  label?: string;
  heading?: string;
  text: string;
}

export interface ReadingPassage {
  title: string;
  subtitle?: string;
  paragraphs: PassageParagraph[];
}

export interface MultipleChoiceQuestion {
  type: 'multiple-choice';
  number: number;
  text: string;
  options: { letter: string; text: string }[];
  answer: string;
}

export interface TrueFalseNGQuestion {
  type: 'true-false-not-given';
  number: number;
  text: string;
  answer: 'TRUE' | 'FALSE' | 'NOT GIVEN';
}

export interface YesNoNGQuestion {
  type: 'yes-no-not-given';
  number: number;
  text: string;
  answer: 'YES' | 'NO' | 'NOT GIVEN';
}

export interface MatchingHeadingsQuestion {
  type: 'matching-headings';
  number: number;
  /** e.g. 'A', 'B', 'C' */
  paragraphLabel: string;
  answer: string;
}

export interface MatchingFeaturesEndingQuestion {
  type: 'matching-features-ending';
  number: number;
  /** The sentence beginning or feature to be matched */
  text: string;
  answer: string;
  // Options live at the group level (MatchingFeaturesEndingGroup.options)
}

export interface DiagramLabelCompletionQuestion {
  type: 'diagram-label-completion';
  number: number;
  text: string;
  answer: string;
}

export interface SentenceCompletionQuestion {
  type: 'sentence-completion';
  number: number;
  beforeBlank: string;
  // Text that appears after the blank (optional) 
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

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseNGQuestion
  | YesNoNGQuestion
  | MatchingHeadingsQuestion
  | SentenceCompletionQuestion
  | MatchingFeaturesEndingQuestion
  | DiagramLabelCompletionQuestion
  | ShortAnswerQuestion;

// ── Question Groups ───────────────────────────────────────────────────────────

interface BaseGroup {
  instruction: string;
  questionRange: { from: number; to: number };
}

export interface StandardGroup extends BaseGroup {
  type: 'multiple-choice' | 'true-false-not-given' | 'yes-no-not-given' | 'sentence-completion' | 'short-answer' | 'diagram-label-completion';
  questions: Question[];
}

/** Matching headings — heading options live at the group level (includes distractors) */
export interface MatchingHeadingsGroup extends BaseGroup {
  type: 'matching-headings';
  headingOptions: { label: string; text: string }[];
  questions: MatchingHeadingsQuestion[];
}

/** Matching features / sentence endings — shared options list at group level */
export interface MatchingFeaturesEndingGroup extends BaseGroup {
  type: 'matching-features-ending';
  /** Shared list of endings / features to match against (may include distractors) */
  options: { letter: string; text: string }[];
  questions: MatchingFeaturesEndingQuestion[];
}

/** Diagram label completion — optional diagram context at group level */
export interface DiagramLabelCompletionGroup extends BaseGroup {
  type: 'diagram-label-completion';
  /** Text description of the diagram (alt text / context) */
  diagramDescription?: string;
  /** URL to the diagram image (optional) */
  diagramImageUrl?: string;
  questions: DiagramLabelCompletionQuestion[];
}

export type QuestionGroup =
  | StandardGroup
  | MatchingHeadingsGroup
  | MatchingFeaturesEndingGroup
  | DiagramLabelCompletionGroup;

// ── Part & Exam ───────────────────────────────────────────────────────────────

export interface ReadingPart {
  partNumber: 1 | 2 | 3;
  passage: ReadingPassage;
  questionGroups: QuestionGroup[];
  /** Absolute question numbers for this part, e.g. { from: 1, to: 13 } */
  questionRange: { from: number; to: number };
}

export interface ReadingExam {
  id: string;
  title: string;
  description?: string;
  durationMins: number;
  parts: [ReadingPart, ReadingPart, ReadingPart];
  totalQuestions: number;
}
