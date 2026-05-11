'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from 'client/components/ui/Button';
import { ICONS } from '@/shared/constants';
import type { ExamTest } from '@/shared/constants';

interface TypeConfig {
  imageSrc: string;
  badgeBg: string;
  label: string;
}

const TYPE_CONFIG: Record<string, TypeConfig> = {
  listening: {
    imageSrc: '/images/exam_types/listening_exam.jpg',
    badgeBg:  'bg-primary',
    label:    'Listening',
  },
  reading: {
    imageSrc: '/images/exam_types/reading_exam.jpg',
    badgeBg:  'bg-green-600',
    label:    'Reading',
  },
  writing: {
    imageSrc: '/images/exam_types/general_academic_exam.jpg',
    badgeBg:  'bg-orange-500',
    label:    'Writing',
  },
  speaking: {
    imageSrc: '/images/exam_types/speaking_exam.jpg',
    badgeBg:  'bg-purple-600',
    label:    'Speaking',
  },
  general: {
    imageSrc: '/images/exam_types/general_academic_exam.jpg',
    badgeBg:  'bg-gray-600',
    label:    'General',
  },
};

const DIFFICULTY_LABEL: Record<string, string> = {
  easy:         'Easy',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
};

interface TestCardProps {
  test: ExamTest;
}

export default function TestCard({ test }: TestCardProps) {
  const { imageSrc, badgeBg, label } = TYPE_CONFIG[test.type] ?? TYPE_CONFIG.general;
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-200 group">
      {/* Image Area */}
      <div className="relative w-full aspect-video">
        <Image
          src={imageSrc}
          alt={label}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <span className={`absolute top-3 left-3 ${badgeBg} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}>
          {label}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="text-gray-900 text-base font-bold leading-snug group-hover:text-primary transition-colors">
          {test.title}
        </h3>

        <div className="flex items-center gap-4 text-gray-500 text-xs font-medium">
          <span className="flex items-center gap-1">
            <ICONS.schedule style={{ fontSize: '1rem' }} />
            {test.durationMins} mins
          </span>
          <span className="flex items-center gap-1">
            <ICONS.performance style={{ fontSize: '1rem' }} />
            {DIFFICULTY_LABEL[test.difficulty]}
          </span>
        </div>

        <Link href={`/exam-library/${test.id}`} className="mt-auto">
          <Button variant="primary" size="small">
            Start Test
          </Button>
        </Link>
      </div>
    </div>
  );
}
