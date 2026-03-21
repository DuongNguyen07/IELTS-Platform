import InfoIcon from '@mui/icons-material/Info';
import { ICONS } from '@/shared/constants';

const INSTRUCTIONS = [
  'You can pause and resume the test at any time during the session.',
  'Your progress and answers are auto-saved locally and to your profile.',
  'Ensure you review all answers before final submission for grading.',
];

export default function InstructionsCard() {
  return (
    <div className="bg-blue-50 rounded-xl border-l-4 border-primary p-6">
      <div className="flex items-center gap-2 mb-4">
        <InfoIcon style={{ fontSize: '1.25rem', color: '#2b6cee' }} />
        <span className="text-gray-900 font-bold text-base">Important Instructions</span>
      </div>

      <ul className="flex flex-col gap-3">
        {INSTRUCTIONS.map((text) => (
          <li key={text} className="flex items-start gap-2.5">
            <ICONS.check
              style={{ fontSize: '1rem', color: '#16a34a', marginTop: '3px', marginLeft: '3px', flexShrink: 0 }}
            />
            <span className="text-gray-500 text-sm leading-relaxed">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
