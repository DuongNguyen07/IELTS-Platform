import { z } from 'zod';

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
  data: ReadingExamDataSchema,
});

export type ExamUploadPayload = z.infer<typeof ExamUploadSchema>;
export type ReadingExamData = z.infer<typeof ReadingExamDataSchema>;
