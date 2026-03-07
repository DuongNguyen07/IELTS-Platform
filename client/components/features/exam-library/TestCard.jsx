'use client';

import Link from 'next/link';
import Button from 'client/components/ui/Button';
import { ICONS } from '@/shared/constants';

const TYPE_CONFIG = {
  listening: {
    Icon:      ICONS.listening,
    iconColor: 'text-primary',
    badgeBg:   'bg-primary',
    cardBg:    'from-blue-50 to-blue-100',
    label:     'Listening',
  },
  reading: {
    Icon:      ICONS.reading,
    iconColor: 'text-green-600',
    badgeBg:   'bg-green-600',
    cardBg:    'from-green-50 to-green-100',
    label:     'Reading',
  },
  writing: {
    Icon:      ICONS.writing,
    iconColor: 'text-orange-500',
    badgeBg:   'bg-orange-500',
    cardBg:    'from-orange-50 to-orange-100',
    label:     'Writing',
  },
  speaking: {
    Icon:      ICONS.speaking,
    iconColor: 'text-purple-600',
    badgeBg:   'bg-purple-600',
    cardBg:    'from-purple-50 to-purple-100',
    label:     'Speaking',
  },
  general: {
    Icon:      ICONS.school,
    iconColor: 'text-gray-600',
    badgeBg:   'bg-gray-600',
    cardBg:    'from-gray-100 to-gray-200',
    label:     'General',
  },
};

const DIFFICULTY_LABEL = {
  easy:         'Easy',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
};

export default function TestCard({ test }) {
  const { Icon, iconColor, badgeBg, cardBg, label } = TYPE_CONFIG[test.type] ?? TYPE_CONFIG.general;
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-200 group">
      {/* Icon Area */}
      <div className={`relative w-full aspect-video bg-gradient-to-br ${cardBg} flex items-center justify-center`}>
        <Icon
          className={`${iconColor} opacity-80 group-hover:scale-110 transition-transform duration-200`}
          style={{ fontSize: '3.5rem' }}
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
