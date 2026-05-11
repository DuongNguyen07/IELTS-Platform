import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { formatDuration } from './constants';
import Button from '../../ui/Button';

interface Props {
  totalDuration: number;
  onStart: () => void;
}

export default function ExamCTA({ totalDuration, onStart }: Props) {
  return (
    <div className="flex items-center justify-between pt-2">
      <div>
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
          Expected Duration
        </p>
        <p className="text-blue-500 text-2xl font-black">{formatDuration(totalDuration)}</p>
      </div>

      <Button
        onClick={onStart}
        disabled={totalDuration === 0}
        size='medium'
        fullWidth={false}
        variant='test'
      >
        Start Test
        <ArrowForwardIcon style={{ fontSize: '1rem' }} />
      </Button>
    </div>
  );
}
