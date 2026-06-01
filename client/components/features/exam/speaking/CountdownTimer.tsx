interface Props {
  seconds: number;
  urgent?: boolean;
}

function fmt(s: number): string {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export default function CountdownTimer({ seconds, urgent }: Props) {
  return (
    <span className={`font-mono font-bold tabular-nums text-xl ${urgent ? 'text-red-500' : 'text-slate-700'}`}>
      {fmt(Math.max(0, seconds))}
    </span>
  );
}
