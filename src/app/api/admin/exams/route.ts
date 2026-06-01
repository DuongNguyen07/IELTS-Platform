import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import prisma from '@/server/lib/prisma';
import { requireAdmin } from '@/server/lib/adminAuth';
import { ExamUploadSchema } from '@/shared/validation/examSchema';

/** GET /api/admin/exams — list all exams (admin only) */
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const exams = await prisma.examContent.findMany({
    select: {
      id: true,
      slug: true,
      skill: true,
      title: true,
      difficulty: true,
      totalQuestions: true,
      durationMins: true,
      isPublished: true,
      version: true,
      createdBy: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(exams);
}

/** POST /api/admin/exams — create a new exam from JSON upload (admin only) */
export async function POST(req: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = ExamUploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.issues.map((i) => `${i.path.join('.') || 'root'}: ${i.message}`) },
      { status: 422 }
    );
  }

  const { slug, skill, difficulty, isPublished, data } = parsed.data;

  // Check slug uniqueness
  const existing = await prisma.examContent.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(
      { error: `Slug "${slug}" is already taken. Use a unique slug.` },
      { status: 409 }
    );
  }

  // SpeakingExamData has no durationMins; WritingExamData/SpeakingExamData have no
  // totalQuestions — omit them and let the Prisma schema defaults (60 / 40) apply.
  const d = data as Record<string, unknown>;

  const exam = await prisma.examContent.create({
    data: {
      slug,
      skill,
      title:       data.title,
      description: data.description,
      ...(typeof d.durationMins   === 'number' && { durationMins:   d.durationMins }),
      ...(typeof d.totalQuestions === 'number' && { totalQuestions: d.totalQuestions }),
      difficulty,
      isPublished,
      data: data as object,
      createdBy: session.user.email ?? undefined,
    },
  });

  revalidateTag('exams', { expire: 0 });
  revalidateTag('dashboard', { expire: 0 });
  return NextResponse.json(exam, { status: 201 });
}
