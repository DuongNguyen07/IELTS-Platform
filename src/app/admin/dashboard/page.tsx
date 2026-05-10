import { unstable_cache } from 'next/cache';
import prisma from '@/server/lib/prisma';
import AdminDashboardWrapper from '@/components/features/admin/AdminDashboardWrapper';
import type { DashboardData } from '@/components/features/admin/AdminDashboardClient';

function weekBuckets(n: number) {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const start = new Date(now);
    start.setDate(start.getDate() - (n - 1 - i) * 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return { start, end, label: `Week ${i + 1}` };
  });
}

const SKILL_COLORS: Record<string, string> = {
  reading:   'oklch(0.62 0.18 255)',
  listening: 'oklch(0.7 0.16 165)',
  writing:   'oklch(0.72 0.17 60)',
  speaking:  'oklch(0.65 0.2 25)',
};

const getDashboardData = unstable_cache(
  async (): Promise<DashboardData> => {
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);
    const sevenWeeksAgo = new Date();
    sevenWeeksAgo.setDate(sevenWeeksAgo.getDate() - 49);

    const [
      totalExams,
      totalUsers,
      totalSubmissions,
      bandAggregate,
      examsBySkillRaw,
      recentExamsRaw,
      allScores,
      sevenWeekTests,
      twelveWeekTests,
      twelveWeekScores,
      twelveWeekUsers,
      twelveWeekExams,
    ] = await Promise.all([
      prisma.examContent.count(),
      prisma.user.count({ where: { role: 'user' } }),
      prisma.test.count({ where: { status: 'completed' } }),
      prisma.score.aggregate({ _avg: { overallBand: true } }),
      prisma.examContent.groupBy({ by: ['skill'], _count: { id: true } }),
      prisma.examContent.findMany({
        select: { title: true, skill: true, isPublished: true },
        orderBy: { updatedAt: 'desc' },
        take: 4,
      }),
      prisma.score.findMany({ select: { overallBand: true } }),
      prisma.test.findMany({
        where: { createdAt: { gte: sevenWeeksAgo }, status: 'completed' },
        select: { createdAt: true, moduleType: true },
      }),
      prisma.test.findMany({
        where: { createdAt: { gte: twelveWeeksAgo }, status: 'completed' },
        select: { createdAt: true },
      }),
      prisma.score.findMany({
        where: { createdAt: { gte: twelveWeeksAgo } },
        select: { createdAt: true, overallBand: true },
      }),
      prisma.user.findMany({
        where: { role: 'user', createdAt: { gte: twelveWeeksAgo } },
        select: { createdAt: true },
      }),
      prisma.examContent.findMany({
        where: { createdAt: { gte: twelveWeeksAgo } },
        select: { createdAt: true },
      }),
    ]);

    const examsBySkill = examsBySkillRaw.map((row) => ({
      name: row.skill.charAt(0).toUpperCase() + row.skill.slice(1),
      value: row._count.id,
      color: SKILL_COLORS[row.skill] ?? 'oklch(0.5 0.1 0)',
    }));

    const recentExams = recentExamsRaw.map((e) => ({
      title: e.title,
      skill: e.skill.charAt(0).toUpperCase() + e.skill.slice(1),
      status: (e.isPublished ? 'Published' : 'Draft') as 'Published' | 'Draft',
    }));

    const BANDS = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0];
    const bandDistribution = BANDS.map((band) => ({
      band: band.toFixed(1),
      count: allScores.filter((s) => s.overallBand >= band && s.overallBand < band + 0.5).length,
    }));

    const seven = weekBuckets(7);
    const submissionsTrend = seven.map(({ start, end, label }) => {
      const week = sevenWeekTests.filter((t) => t.createdAt >= start && t.createdAt < end);
      return {
        week: label,
        Reading:   week.filter((t) => t.moduleType === 'reading').length,
        Listening: week.filter((t) => t.moduleType === 'listening').length,
        Writing:   week.filter((t) => t.moduleType === 'writing').length,
        Speaking:  week.filter((t) => t.moduleType === 'speaking').length,
      };
    });

    const twelve = weekBuckets(12);
    const sparkExams       = twelve.map(({ start, end }) => twelveWeekExams.filter((e) => e.createdAt >= start && e.createdAt < end).length);
    const sparkUsers       = twelve.map(({ start, end }) => twelveWeekUsers.filter((u) => u.createdAt >= start && u.createdAt < end).length);
    const sparkSubmissions = twelve.map(({ start, end }) => twelveWeekTests.filter((t) => t.createdAt >= start && t.createdAt < end).length);
    const sparkBand        = twelve.map(({ start, end }) => {
      const week = twelveWeekScores.filter((s) => s.createdAt >= start && s.createdAt < end);
      return week.length ? week.reduce((sum, s) => sum + s.overallBand, 0) / week.length : 0;
    });

    return {
      totalExams, totalUsers, totalSubmissions,
      avgBand: bandAggregate._avg.overallBand,
      examsBySkill, recentExams, bandDistribution, submissionsTrend,
      sparkExams, sparkUsers, sparkSubmissions, sparkBand,
    };
  },
  ['admin-dashboard'],
  { revalidate: 60, tags: ['dashboard'] }
);

export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  return <AdminDashboardWrapper data={data} />;
}
