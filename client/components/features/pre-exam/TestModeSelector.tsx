import TimerIcon from '@mui/icons-material/Timer';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import type { TestMode } from './types';

const MODES: {
  value: TestMode;
  Icon: typeof TimerIcon;
  label: string;
  description: string;
}[] = [
  {
    value: 'timed',
    Icon: TimerIcon,
    label: 'Timed Mode',
    description: 'Strict IELTS timing with auto-submission when time is up.',
  },
  {
    value: 'practice',
    Icon: MenuBookIcon,
    label: 'Practice Mode',
    description: 'Untimed session. Recommended for initial skill building.',
  },
];

interface Props {
  value: TestMode;
  onChange: (mode: TestMode) => void;
}

export default function TestModeSelector({ value, onChange }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-gray-900 text-xl font-bold tracking-tight px-1">Test Mode</h2>

      <div className="grid grid-cols-2 gap-4">
        {MODES.map(({ value: mode, Icon, label, description }) => (
          <div
            key={mode}
            onClick={() => onChange(mode)}
            className={[
              'bg-white rounded-xl p-6 cursor-pointer border-2 transition-all duration-150',
              value === mode
                ? 'border-primary shadow-sm shadow-primary/10'
                : 'border-transparent hover:border-gray-200',
            ].join(' ')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon style={{ fontSize: '1.1rem', color: '#2b6cee' }} />
              <span className="text-gray-900 font-bold text-sm">{label}</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
