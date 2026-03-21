import TestCard from './TestCard';
import type { ExamTest } from '@/shared/constants';

interface TestGridProps {
  tests: ExamTest[];
}

export default function TestGrid({ tests }: TestGridProps) {
  if (tests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-lg font-semibold">No tests found</p>
        <p className="text-sm mt-1">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tests.map((test) => (
        <TestCard key={test.id} test={test} />
      ))}
    </div>
  );
}
