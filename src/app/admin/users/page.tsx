import { unstable_cache } from 'next/cache';
import prisma from '@/server/lib/prisma';
import StudentTable from '@/components/features/admin/StudentTable';
import type { StudentRow } from '@/components/features/admin/StudentTable';

function deriveStatus(lastActivity: Date | null, attempts: number): StudentRow['status'] {
  if (attempts === 0) return 'Pending';
  if (!lastActivity) return 'Inactive';
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  return lastActivity >= cutoff ? 'Active' : 'Inactive';
}

const getStudents = unstable_cache(
  async (): Promise<StudentRow[]> => {
    const users = await prisma.user.findMany({
      where: { role: 'user' },
      select: {
        id: true,
        name: true,
        email: true,
        currentBand: true,
        lastActivity: true,
        createdAt: true,
        _count: { select: { tests: { where: { status: 'completed' } } } },
        scores: {
          select: { overallBand: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u) => {
      const attempts = u._count.tests;
      return {
        id: u.id,
        name: u.name ?? 'Anonymous',
        email: u.email,
        status: deriveStatus(u.lastActivity, attempts),
        attempts,
        band: u.scores[0]?.overallBand ?? u.currentBand ?? 0,
        joined: u.createdAt.toISOString(),
      };
    });
  },
  ['admin-students'],
  { revalidate: 60, tags: ['students'] }
);

export default async function AdminUsersPage() {
  const students = await getStudents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Student Management</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          {students.length} registered student{students.length !== 1 ? 's' : ''}.
        </p>
      </div>

      <StudentTable students={students} />
    </div>
  );
}
