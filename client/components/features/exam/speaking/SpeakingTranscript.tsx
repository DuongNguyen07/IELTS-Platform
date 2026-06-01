interface Props {
  text: string;
  isRecording: boolean;
}

export default function SpeakingTranscript({ text, isRecording }: Props) {
  const isEmpty = text.trim() === '';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Your response
        </span>
        {isRecording && (
          <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Live
          </span>
        )}
      </div>
      <div className="min-h-28 bg-gray-50 rounded-xl border border-gray-200 px-5 py-4">
        {isEmpty ? (
          <p className="text-slate-400 italic text-sm">
            {isRecording
              ? 'Listening… your words will appear here.'
              : 'Start speaking — your words will appear here.'}
          </p>
        ) : (
          <p className="text-slate-700 text-sm leading-relaxed">&ldquo;{text}&rdquo;</p>
        )}
      </div>
    </div>
  );
}
