import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'server/config/auth';
import prisma from 'server/lib/prisma';

/** GET /api/exams/[slug] — single published exam metadata (authenticated users) */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const exam = await prisma.examContent.findFirst({
    where: { slug, isPublished: true },
    select: {
      slug: true,
      skill: true,
      title: true,
      difficulty: true,
      totalQuestions: true,
      durationMins: true,
      createdAt: true,
    },
  });

  if (!exam) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: exam.slug,
    title: exam.title,
    type: exam.skill,
    difficulty: exam.difficulty,
    totalQuestions: exam.totalQuestions,
    durationMins: exam.durationMins,
    createdAt: exam.createdAt,
  });
}
