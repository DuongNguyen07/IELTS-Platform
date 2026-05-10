import ExamUploadForm from '@/components/features/admin/ExamUploadForm';

export default function UploadExamPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Upload Exam</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          Paste or upload a JSON file following the exam format. Validate before saving.
        </p>
      </div>

      <ExamUploadForm />
    </div>
  );
}
