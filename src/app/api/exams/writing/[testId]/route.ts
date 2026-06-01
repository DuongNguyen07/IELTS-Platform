import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/config/auth';
import prisma from '@/server/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ testId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const { testId } = await params;
  const exam = await prisma.examContent.findUnique({
    where: { slug: testId },
    select: {
      slug: true,
      skill: true,
      title: true,
      description: true,
      durationMins: true,
      isPublished: true,
      data: true,
    },
  });

  if (!exam || !exam.isPublished || exam.skill !== 'writing') {
    return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: exam.slug,
    title: exam.title,
    description: exam.description,
    durationMins: exam.durationMins,
    ...(exam.data as object),
  });
}
