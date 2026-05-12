// Question types
export type QuestionType =
  | 'multiple-choice'
  | 'multiple-choice-many'
  | 'true-false-not-given'
  | 'yes-no-not-given'
  | 'matching-headings'
  | 'matching-features-ending'
  | 'matching-information'
  | 'diagram-label-completion'
  | 'sentence-completion'
  | 'gap-filling'
  | 'short-answer'
  | 'other';

// Passage

export interface PassageParagraph {
  label?: string;
  heading?: string;
  text: string;
}

export interface ReadingPassage {
  title: string;
  subtitle?: string;
  paragraphs: PassageParagraph[];
}

// Question interfaces

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
  paragraphLabel: string;
  answer: string;
}

export interface MatchingFeaturesEndingQuestion {
  type: 'matching-features-ending';
  number: number;
  text: string;
  answer: string;
}

export interface MatchingInformationQuestion {
  type: 'matching-information';
  number: number;
  text: string;
  answer: string;
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
  afterBlank?: string;
  answer: string;
  wordLimit?: number;
}

export interface GapFillingQuestion {
  type: 'gap-filling';
  number: number;
  beforeBlank?: string;
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

export interface OtherQuestion {
  type: 'other';
  number: number;
  text: string;
  answer: string;
}

export type Question =
  | MultipleChoiceQuestion
  | MultipleChoiceManyQuestion
  | TrueFalseNGQuestion
  | YesNoNGQuestion
  | MatchingHeadingsQuestion
  | MatchingFeaturesEndingQuestion
  | MatchingInformationQuestion
  | DiagramLabelCompletionQuestion
  | SentenceCompletionQuestion
  | GapFillingQuestion
  | ShortAnswerQuestion
  | OtherQuestion;

// Question Groups

interface BaseGroup {
  instruction: string;
  questionRange: { from: number; to: number };
}

export interface StandardGroup extends BaseGroup {
  type: 'multiple-choice' | 'multiple-choice-many' | 'true-false-not-given' | 'yes-no-not-given' | 'sentence-completion' | 'short-answer' | 'other';
  questions: Question[];
}

export interface MatchingHeadingsGroup extends BaseGroup {
  type: 'matching-headings';
  headingOptions: { label: string; text: string }[];
  questions: MatchingHeadingsQuestion[];
}

export interface MatchingFeaturesEndingGroup extends BaseGroup {
  type: 'matching-features-ending';
  options: { letter: string; text: string }[];
  questions: MatchingFeaturesEndingQuestion[];
}

export interface MatchingInformationGroup extends BaseGroup {
  type: 'matching-information';
  paragraphLabels: string[];
  questions: MatchingInformationQuestion[];
}

export interface DiagramLabelCompletionGroup extends BaseGroup {
  type: 'diagram-label-completion';
  diagramDescription?: string;
  diagramImageUrl?: string;
  questions: DiagramLabelCompletionQuestion[];
}

export interface GapFillingGroup extends BaseGroup {
  type: 'gap-filling';
  contextText?: string;
  questions: GapFillingQuestion[];
}

export type QuestionGroup =
  | StandardGroup
  | MatchingHeadingsGroup
  | MatchingFeaturesEndingGroup
  | MatchingInformationGroup
  | DiagramLabelCompletionGroup
  | GapFillingGroup;

// Parts and Exam

export interface ReadingPart {
  partNumber: 1 | 2 | 3;
  passage: ReadingPassage;
  questionGroups: QuestionGroup[];
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
