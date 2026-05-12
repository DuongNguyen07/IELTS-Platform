import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'server/config/auth';
import prisma from 'server/lib/prisma';

/** GET /api/exams — list all published exams (authenticated users) */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const exams = await prisma.examContent.findMany({
    where: { isPublished: true },
    select: {
      slug: true,
      skill: true,
      title: true,
      difficulty: true,
      totalQuestions: true,
      durationMins: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(
    exams.map((e) => ({
      id: e.slug,
      title: e.title,
      type: e.skill,
      difficulty: e.difficulty,
      totalQuestions: e.totalQuestions,
      durationMins: e.durationMins,
      createdAt: e.createdAt,
    }))
  );
}
