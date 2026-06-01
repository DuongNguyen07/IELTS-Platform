import { notFound } from 'next/navigation';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import prisma from '@/server/lib/prisma';
import { requireAdmin } from '@/server/lib/adminAuth';
import ExamEditForm from '@/components/features/admin/ExamEditForm';

interface Props { params: Promise<{ id: string }> }

export default async function EditExamPage({ params }: Props) {
  const { id } = await params;
  const { error } = await requireAdmin();
  if (error) return null;

  const exam = await prisma.examContent.findUnique({ where: { id } });
  if (!exam) notFound();

  const initial = {
    id: exam.id,
    slug: exam.slug,
    skill: exam.skill as 'reading' | 'listening' | 'writing' | 'speaking',
    difficulty: exam.difficulty as 'easy' | 'intermediate' | 'advanced',
    isPublished: exam.isPublished,
    data: exam.data as object,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/exams"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-2"
          >
            <ArrowBackIcon style={{ fontSize: '1rem' }} /> All Exams
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Edit Exam</h1>
          <p className="text-sm mt-1 font-mono" style={{ color: 'var(--muted-foreground)' }}>
            {exam.slug} · v{exam.version}
          </p>
        </div>

        <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
          exam.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
        }`}>
          {exam.isPublished ? 'Published' : 'Draft'}
        </span>
      </div>

      <ExamEditForm initial={initial} />
    </div>
  );
}
