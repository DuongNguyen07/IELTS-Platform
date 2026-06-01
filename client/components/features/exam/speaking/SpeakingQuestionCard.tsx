const PART_LABELS: Record<number, string> = {
  1: 'Personal Questions',
  2: 'Long Turn',
  3: 'Discussion',
};

interface Props {
  partNumber: number;
  questionNumber: number;
  text: string;
  bulletPoints?: string[];
}

export default function SpeakingQuestionCard({ partNumber, questionNumber, text, bulletPoints }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
          Part {partNumber}
        </span>
        <span className="text-xs text-slate-500">{PART_LABELS[partNumber]}</span>
        <span className="ml-auto text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
          Q{questionNumber}
        </span>
      </div>

      <p className="text-xl font-medium text-slate-800 leading-relaxed">{text}</p>

      {/* Part 2 cue card bullet points */}
      {bulletPoints && bulletPoints.length > 0 && (
        <div className="mt-6 border-t border-gray-100 pt-5">
          <p className="text-sm text-slate-500 mb-3 font-medium">You should say:</p>
          <ul className="space-y-2">
            {bulletPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="text-primary font-bold mt-0.5 flex-shrink-0">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
