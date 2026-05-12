import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/config/auth';
import prisma from '@/server/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ testId: string }> }
) {
  // Must be logged in to access exam content
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const { testId } = await params;
  const exam = await prisma.examContent.findUnique({
    where: { slug: testId },
    select: {
      slug: true,
      title: true,
      description: true,
      durationMins: true,
      totalQuestions: true,
      difficulty: true,
      isPublished: true,
      data: true,
    },
  });

  if (!exam || !exam.isPublished) {
    return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
  }

  // Return the exam data with the slug as the id (used by ReadingExam component)
  return NextResponse.json({
    id: exam.slug,
    title: exam.title,
    description: exam.description,
    durationMins: exam.durationMins,
    totalQuestions: exam.totalQuestions,
    ...(exam.data as object),
  });
}
