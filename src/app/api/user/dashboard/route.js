import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // 1. Get authenticated user from JWT
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch user data with relations
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        progress: {
          where: { status: 'in_progress' },
          orderBy: { lastAccessed: 'desc' },
          take: 1
        },
        tests: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { score: true }
        },
        studyGoals: {
          where: { isActive: true }
        }
      }
    });

    // 3. Calculate statistics
    const totalTests = await prisma.test.count({
      where: { userId: user.id, status: 'completed' }
    });

    const averageScore = await prisma.score.aggregate({
      where: { userId: user.id },
      _avg: { overallBand: true }
    });

    // 4. Return dashboard data
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        targetScore: user.targetScore,
        currentBand: averageScore._avg.overallBand || 0,
        journeyProgress: user.journeyProgress || 0,
        studyHours: user.studyHours || 0,
      },
      continueLearning: user.progress[0] || null,
      stats: {
        testsTaken: totalTests,
        averageBand: averageScore._avg.overallBand || 0,
        studyHours: user.studyHours || 0,
      },
      recentTests: user.tests,
      studyGoal: user.studyGoals[0] || null,
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}