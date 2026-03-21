import { NextResponse } from 'next/server';
import prisma from '@/server/lib/prisma';
import { requireAuth } from '@/server/middleware/auth';

export async function GET() {
  try {
    // Get authenticated user
    const { user } = await requireAuth();

    // Fetch user data with relations
    const userWithRelations = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        progress: {
          where: { status: 'in_progress' },
          orderBy: { lastAccessed: 'desc' },
          take: 1
        },
        tests: {
          where: { status: 'completed' },
          orderBy: { completedAt: 'desc' },
          take: 5,
          include: { score: true }
        },
        studyGoals: {
          where: { isActive: true },
          take: 1
        }
      }
    });

    if (!userWithRelations) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate statistics — run in parallel
    const [totalTests, averageScore, totalProgress] = await Promise.all([
      prisma.test.count({
        where: { userId: user.id, status: 'completed' },
      }),
      prisma.score.aggregate({
        where: { userId: user.id },
        _avg: { overallBand: true },
      }),
      prisma.progress.count({
        where: { userId: user.id, status: 'completed' },
      }),
    ]);

    // Get continue learning data
    const continueLearning = userWithRelations.progress[0] || null;

    // Return dashboard data
    return NextResponse.json({
      user: {
        id: userWithRelations.id,
        name: userWithRelations.name,
        email: userWithRelations.email,
        targetScore: (userWithRelations as Record<string, unknown>).targetScore || 7.0,
        currentBand: (userWithRelations as Record<string, unknown>).currentBand || averageScore._avg.overallBand || 0,
        journeyProgress: (userWithRelations as Record<string, unknown>).journeyProgress || 0,
        studyHours: (userWithRelations as Record<string, unknown>).studyHours || 0,
        plan: (userWithRelations as Record<string, unknown>).plan || 'free',
        joinedDate: userWithRelations.createdAt,
      },
      continueLearning: continueLearning ? {
        id: continueLearning.id,
        title: (continueLearning as Record<string, unknown>).lessonTitle,
        description: (continueLearning as Record<string, unknown>).moduleType,
        progress: (continueLearning as Record<string, unknown>).progressPercent,
        lastAccessed: continueLearning.lastAccessed,
        url: `/dashboard/lessons/${(continueLearning as Record<string, unknown>).lessonId}`,
      } : null,
      stats: {
        practiceTests: totalTests,
        studyHours: (userWithRelations as Record<string, unknown>).studyHours || 0,
        completedLessons: totalProgress,
        averageScore: averageScore._avg.overallBand || 0,
      },
      recentTests: userWithRelations.tests.map(test => ({
        id: test.id,
        moduleType: (test as Record<string, unknown>).moduleType,
        testType: (test as Record<string, unknown>).testType,
        completedAt: (test as Record<string, unknown>).completedAt,
        score: (test as Record<string, unknown> & { score?: { overallBand?: number } }).score?.overallBand || null,
      })),
      studyGoal: userWithRelations.studyGoals[0] || null,
    });

  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
