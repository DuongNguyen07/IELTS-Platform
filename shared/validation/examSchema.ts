import { z } from 'zod';

// ── Listening question schemas ─────────────────────────────────────────────────

const ListeningMCSchema = z.object({
  type: z.literal('multiple-choice'),
  number: z.number().int().positive(),
  text: z.string().min(1),
  options: z.array(z.object({ letter: z.string().length(1), text: z.string().min(1) })).min(2),
  answer: z.string().min(1),
});

const ListeningMCManySchema = z.object({
  type: z.literal('multiple-choice-many'),
  number: z.number().int().positive(),
  text: z.string().min(1),
  options: z.array(z.object({ letter: z.string().length(1), text: z.string().min(1) })).min(2),
  chooseCount: z.number().int().positive(),
  answers: z.array(z.string().min(1)).min(1),
});

const ListeningMatchingQSchema = z.object({
  type: z.literal('matching'),
  number: z.number().int().positive(),
  text: z.string().min(1),
  answer: z.string().min(1),
});

const PlanMapDiagramQSchema = z.object({
  type: z.literal('plan-map-diagram'),
  number: z.number().int().positive(),
  locationLabel: z.string().min(1),
  answer: z.string().min(1),
  wordLimit: z.number().int().positive().optional(),
});

const FormCompletionQSchema = z.object({
  type: z.literal('form-completion'),
  number: z.number().int().positive(),
  fieldLabel: z.string().min(1),
  answer: z.string().min(1),
  wordLimit: z.number().int().positive().optional(),
});

const NoteCompletionQSchema = z.object({
  type: z.literal('note-completion'),
  number: z.number().int().positive(),
  beforeBlank: z.string().optional(),
  afterBlank: z.string().optional(),
  answer: z.string().min(1),
  wordLimit: z.number().int().positive().optional(),
});

const TableCompletionQSchema = z.object({
  type: z.literal('table-completion'),
  number: z.number().int().positive(),
  rowLabel: z.string().optional(),
  columnLabel: z.string().optional(),
  beforeBlank: z.string().optional(),
  afterBlank: z.string().optional(),
  answer: z.string().min(1),
  wordLimit: z.number().int().positive().optional(),
});

const FlowChartCompletionQSchema = z.object({
  type: z.literal('flow-chart-completion'),
  number: z.number().int().positive(),
  beforeBlank: z.string().optional(),
  afterBlank: z.string().optional(),
  answer: z.string().min(1),
  wordLimit: z.number().int().positive().optional(),
});

const SummaryCompletionQSchema = z.object({
  type: z.literal('summary-completion'),
  number: z.number().int().positive(),
  beforeBlank: z.string().optional(),
  afterBlank: z.string().optional(),
  answer: z.string().min(1),
  wordLimit: z.number().int().positive().optional(),
});

const ListeningSentenceCompletionQSchema = z.object({
  type: z.literal('sentence-completion'),
  number: z.number().int().positive(),
  beforeBlank: z.string().min(1),
  afterBlank: z.string().optional(),
  answer: z.string().min(1),
  wordLimit: z.number().int().positive().optional(),
});

const ListeningShortAnswerQSchema = z.object({
  type: z.literal('short-answer'),
  number: z.number().int().positive(),
  text: z.string().min(1),
  answer: z.string().min(1),
  wordLimit: z.number().int().positive().optional(),
});

const ListeningQuestionSchema = z.discriminatedUnion('type', [
  ListeningMCSchema,
  ListeningMCManySchema,
  ListeningMatchingQSchema,
  PlanMapDiagramQSchema,
  FormCompletionQSchema,
  NoteCompletionQSchema,
  TableCompletionQSchema,
  FlowChartCompletionQSchema,
  SummaryCompletionQSchema,
  ListeningSentenceCompletionQSchema,
  ListeningShortAnswerQSchema,
]);

// ── Listening question group schemas ──────────────────────────────────────────

const listeningBaseGroup = {
  instruction: z.string().min(1, 'Instruction text is required'),
  questionRange: z.object({ from: z.number().int().positive(), to: z.number().int().positive() }),
};

const ListeningStandardGroupSchema = z.object({
  ...listeningBaseGroup,
  type: z.enum(['multiple-choice', 'multiple-choice-many', 'short-answer', 'sentence-completion']),
  questions: z.array(ListeningQuestionSchema).min(1),
});

const ListeningMatchingGroupSchema = z.object({
  ...listeningBaseGroup,
  type: z.literal('matching'),
  options: z.array(z.object({ letter: z.string().min(1), text: z.string().min(1) })).min(2),
  questions: z.array(ListeningMatchingQSchema).min(1),
});

const PlanMapDiagramGroupSchema = z.object({
  ...listeningBaseGroup,
  type: z.literal('plan-map-diagram'),
  imageUrl: z.string().optional(),
  imageDescription: z.string().optional(),
  questions: z.array(PlanMapDiagramQSchema).min(1),
});

const FormCompletionGroupSchema = z.object({
  ...listeningBaseGroup,
  type: z.literal('form-completion'),
  formTitle: z.string().optional(),
  questions: z.array(FormCompletionQSchema).min(1),
});

const NoteCompletionGroupSchema = z.object({
  ...listeningBaseGroup,
  type: z.literal('note-completion'),
  notesTitle: z.string().optional(),
  questions: z.array(NoteCompletionQSchema).min(1),
});

const TableCompletionGroupSchema = z.object({
  ...listeningBaseGroup,
  type: z.literal('table-completion'),
  tableTitle: z.string().optional(),
  columnHeaders: z.array(z.string()).optional(),
  questions: z.array(TableCompletionQSchema).min(1),
});

const FlowChartCompletionGroupSchema = z.object({
  ...listeningBaseGroup,
  type: z.literal('flow-chart-completion'),
  chartTitle: z.string().optional(),
  questions: z.array(FlowChartCompletionQSchema).min(1),
});

const SummaryCompletionGroupSchema = z.object({
  ...listeningBaseGroup,
  type: z.literal('summary-completion'),
  summaryTitle: z.string().optional(),
  questions: z.array(SummaryCompletionQSchema).min(1),
});

const ListeningQuestionGroupSchema = z.union([
  ListeningStandardGroupSchema,
  ListeningMatchingGroupSchema,
  PlanMapDiagramGroupSchema,
  FormCompletionGroupSchema,
  NoteCompletionGroupSchema,
  TableCompletionGroupSchema,
  FlowChartCompletionGroupSchema,
  SummaryCompletionGroupSchema,
]);

const ListeningSectionSchema = z.object({
  sectionNumber: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  audioUrl: z.string().optional(),
  questionGroups: z.array(ListeningQuestionGroupSchema).min(1),
  questionRange: z.object({ from: z.number().int().positive(), to: z.number().int().positive() }),
});

export const ListeningExamDataSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().min(1, 'Exam title is required'),
  description: z.string().optional(),
  durationMins: z.number().int().positive().default(30),
  totalQuestions: z.number().int().positive(),
  sections: z.tuple([
    ListeningSectionSchema,
    ListeningSectionSchema,
    ListeningSectionSchema,
    ListeningSectionSchema,
  ]),
});

export type ListeningExamData = z.infer<typeof ListeningExamDataSchema>;

// ── Reading schemas ───────────────────────────────────────────────────────────

const PassageParagraphSchema = z.object({
  label: z.string().optional(),
  heading: z.string().optional(),
  text: z.string().min(1, 'Paragraph text cannot be empty'),
});

const ReadingPassageSchema = z.object({
  title: z.string().min(1, 'Passage title is required'),
  subtitle: z.string().optional(),
  paragraphs: z.array(PassageParagraphSchema).min(1, 'Passage must have at least one paragraph'),
});

const MultipleChoiceSchema = z.object({
  type: z.literal('multiple-choice'),
  number: z.number().int().positive(),
  text: z.string().min(1),
  options: z
    .array(z.object({ letter: z.string().length(1), text: z.string().min(1) }))
    .min(2, 'Multiple choice must have at least 2 options'),
  answer: z.string().min(1),
});

const TrueFalseNGSchema = z.object({
  type: z.literal('true-false-not-given'),
  number: z.number().int().positive(),
  text: z.string().min(1),
  answer: z.enum(['TRUE', 'FALSE', 'NOT GIVEN']),
});

const YesNoNGSchema = z.object({
  type: z.literal('yes-no-not-given'),
  number: z.number().int().positive(),
  text: z.string().min(1),
  answer: z.enum(['YES', 'NO', 'NOT GIVEN']),
});

const MatchingHeadingsQuestionSchema = z.object({
  type: z.literal('matching-headings'),
  number: z.number().int().positive(),
  paragraphLabel: z.string().min(1),
  answer: z.string().min(1),
});

const MatchingFeaturesEndingQuestionSchema = z.object({
  type: z.literal('matching-features-ending'),
  number: z.number().int().positive(),
  text: z.string().min(1),
  answer: z.string().min(1),
});

const DiagramLabelSchema = z.object({
  type: z.literal('diagram-label-completion'),
  number: z.number().int().positive(),
  text: z.string().min(1),
  answer: z.string().min(1),
});

const SentenceCompletionSchema = z.object({
  type: z.literal('sentence-completion'),
  number: z.number().int().positive(),
  beforeBlank: z.string().min(1),
  afterBlank: z.string().optional(),
  answer: z.string().min(1),
  wordLimit: z.number().int().positive().optional(),
});

const ShortAnswerSchema = z.object({
  type: z.literal('short-answer'),
  number: z.number().int().positive(),
  text: z.string().min(1),
  answer: z.string().min(1),
  wordLimit: z.number().int().positive().optional(),
});

// ── Question Groups ───────────────────────────────────────────────────────────

const baseGroupFields = {
  instruction: z.string().min(1, 'Instruction text is required'),
  questionRange: z.object({
    from: z.number().int().positive(),
    to: z.number().int().positive(),
  }),
};

const StandardGroupSchema = z.object({
  ...baseGroupFields,
  type: z.enum([
    'multiple-choice',
    'true-false-not-given',
    'yes-no-not-given',
    'sentence-completion',
    'short-answer',
    'diagram-label-completion',
  ]),
  questions: z.array(
    z.discriminatedUnion('type', [
      MultipleChoiceSchema,
      TrueFalseNGSchema,
      YesNoNGSchema,
      SentenceCompletionSchema,
      ShortAnswerSchema,
      DiagramLabelSchema,
    ])
  ).min(1),
});

const MatchingHeadingsGroupSchema = z.object({
  ...baseGroupFields,
  type: z.literal('matching-headings'),
  headingOptions: z
    .array(z.object({ label: z.string().min(1), text: z.string().min(1) }))
    .min(1, 'Heading options are required'),
  questions: z.array(MatchingHeadingsQuestionSchema).min(1),
});

const MatchingFeaturesEndingGroupSchema = z.object({
  ...baseGroupFields,
  type: z.literal('matching-features-ending'),
  options: z
    .array(z.object({ letter: z.string().min(1), text: z.string().min(1) }))
    .min(2, 'Options list is required'),
  questions: z.array(MatchingFeaturesEndingQuestionSchema).min(1),
});

const DiagramLabelGroupSchema = z.object({
  ...baseGroupFields,
  type: z.literal('diagram-label-completion'),
  diagramDescription: z.string().optional(),
  diagramImageUrl: z.string().url().optional(),
  questions: z.array(DiagramLabelSchema).min(1),
});

const QuestionGroupSchema = z.union([
  StandardGroupSchema,
  MatchingHeadingsGroupSchema,
  MatchingFeaturesEndingGroupSchema,
  DiagramLabelGroupSchema,
]);

// ── Reading Part ──────────────────────────────────────────────────────────────

const ReadingPartSchema = z.object({
  partNumber: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  passage: ReadingPassageSchema,
  questionGroups: z.array(QuestionGroupSchema).min(1),
  questionRange: z.object({
    from: z.number().int().positive(),
    to: z.number().int().positive(),
  }),
});

// ── Full Reading Exam (the shape stored in ExamContent.data) ──────────────────

export const ReadingExamDataSchema = z.object({
  title: z.string().min(1, 'Exam title is required'),
  description: z.string().optional(),
  durationMins: z.number().int().positive().default(60),
  totalQuestions: z.number().int().positive(),
  parts: z
    .tuple([ReadingPartSchema, ReadingPartSchema, ReadingPartSchema])
    .refine(
      (parts) => {
        // Verify question ranges are contiguous and match totalQuestions claim
        const sorted = [...parts].sort((a, b) => a.questionRange.from - b.questionRange.from);
        return sorted[0].questionRange.from === 1;
      },
      { message: 'Part 1 must start at question 1' }
    ),
});

// ── Writing schemas ───────────────────────────────────────────────────────────

const WritingVisualTypeEnum = z.enum([
  'line_graph', 'bar_chart', 'pie_chart', 'table', 'mixed', 'map', 'process',
]);

const WritingTaskSchema = z.object({
  taskNumber: z.union([z.literal(1), z.literal(2)]),
  taskType: z.enum(['academic', 'general']),
  title: z.string().min(1, 'Task title is required'),
  prompt: z.string().min(1, 'Task prompt is required'),
  minWords: z.number().int().positive(),
  timeRecommendedMins: z.number().int().positive(),
  visualType: WritingVisualTypeEnum.nullable().optional(),
  visualUrl: z.string().nullable().optional(),
});

export const WritingExamDataSchema = z.object({
  title: z.string().min(1, 'Exam title is required'),
  description: z.string().optional(),
  durationMins: z.number().int().positive().default(60),
  tasks: z.tuple([WritingTaskSchema, WritingTaskSchema]),
});

// ── Speaking schemas ──────────────────────────────────────────────────────────

const SpeakingQuestionSchema = z.object({
  questionNumber: z.number().int().positive(),
  text: z.string().min(1, 'Question text is required'),
  bulletPoints: z.array(z.string().min(1)).optional(),
  timeLimitSecs: z.number().int().positive(),
  prepTimeSecs: z.number().int().positive().optional(),
});

const SpeakingPartSchema = z.object({
  partNumber: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  title: z.string().min(1, 'Part title is required'),
  description: z.string().optional(),
  questions: z.array(SpeakingQuestionSchema).min(1, 'Part must have at least one question'),
});

export const SpeakingExamDataSchema = z.object({
  title: z.string().min(1, 'Exam title is required'),
  description: z.string().optional(),
  parts: z.tuple([SpeakingPartSchema, SpeakingPartSchema, SpeakingPartSchema]),
});

// ── Admin upload envelope (metadata + exam data) ──────────────────────────────

export const SkillEnum = z.enum(['reading', 'listening', 'writing', 'speaking']);
export const DifficultyEnum = z.enum(['easy', 'intermediate', 'advanced']);

export const ExamUploadSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers and hyphens'),
  skill: SkillEnum,
  difficulty: DifficultyEnum.default('intermediate'),
  isPublished: z.boolean().default(false),
  data: z.union([
    ReadingExamDataSchema,
    ListeningExamDataSchema,
    WritingExamDataSchema,
    SpeakingExamDataSchema,
  ]),
});

export type ExamUploadPayload = z.infer<typeof ExamUploadSchema>;
export type ReadingExamData   = z.infer<typeof ReadingExamDataSchema>;
export type WritingExamData   = z.infer<typeof WritingExamDataSchema>;
export type SpeakingExamData  = z.infer<typeof SpeakingExamDataSchema>;
