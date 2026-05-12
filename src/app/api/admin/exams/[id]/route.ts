import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import prisma from '@/server/lib/prisma';
import { requireAdmin } from '@/server/lib/adminAuth';
import { ExamUploadSchema } from '@/shared/validation/examSchema';

/** PATCH /api/admin/exams/[id] — update exam metadata or data */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const existing = await prisma.examContent.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { data: examData, isPublished, difficulty, slug } = body as Record<string, unknown>;

  if (examData !== undefined) {
    const parsed = ExamUploadSchema.safeParse({
      slug: slug ?? existing.slug,
      skill: existing.skill,
      difficulty: difficulty ?? existing.difficulty,
      isPublished: isPublished ?? existing.isPublished,
      data: examData,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const updated = await prisma.examContent.update({
      where: { id },
      data: {
        title: parsed.data.data.title,
        description: parsed.data.data.description,
        durationMins: parsed.data.data.durationMins,
        totalQuestions: parsed.data.data.totalQuestions,
        difficulty: parsed.data.difficulty,
        isPublished: parsed.data.isPublished,
        data: parsed.data.data as object,
        version: { increment: 1 },
      },
    });
    revalidateTag('exams', { expire: 0 });
    return NextResponse.json(updated);
  }

  const updated = await prisma.examContent.update({
    where: { id },
    data: {
      ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
      ...(difficulty !== undefined && { difficulty: String(difficulty) }),
    },
  });

  revalidateTag('exams', { expire: 0 });
  return NextResponse.json(updated);
}

/** DELETE /api/admin/exams/[id] */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const existing = await prisma.examContent.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
  }

  await prisma.examContent.delete({ where: { id } });
  revalidateTag('exams', { expire: 0 });
  return NextResponse.json({ success: true });
}
