import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import prisma from '@/server/lib/prisma';
import ExamList from '@/components/features/admin/ExamList';

const getExams = unstable_cache(
  async () => {
    const exams = await prisma.examContent.findMany({
      select: {
        id: true, slug: true, skill: true, title: true,
        difficulty: true, totalQuestions: true, durationMins: true,
        isPublished: true, version: true, createdBy: true,
        createdAt: true, updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return exams.map(({ createdAt, updatedAt, ...rest }) => ({
      ...rest,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    }));
  },
  ['admin-exams'],
  { revalidate: 30, tags: ['exams'] }
);

export default async function AdminExamsPage() {
  const exams = await getExams();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">All Exams</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            {exams.length} exam{exams.length !== 1 ? 's' : ''} in the question bank.
          </p>
        </div>
        <Link
          href="/admin/exams/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          + New Exam
        </Link>
      </div>

      <ExamList initialExams={exams} />
    </div>
  );
}
