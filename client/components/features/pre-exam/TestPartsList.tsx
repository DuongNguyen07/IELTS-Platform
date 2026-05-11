import type { TestPart } from './types';

interface PartRowProps {
  part: TestPart;
  onToggle: (id: string) => void;
}

function PartRow({ part, onToggle }: PartRowProps) {
  return (
    <div
      onClick={() => part.enabled && onToggle(part.id)}
      className={[
        'bg-white rounded-xl border p-4 flex items-center justify-between transition-all duration-150',
        part.enabled
          ? 'border-gray-200 cursor-pointer hover:border-primary/40 hover:shadow-sm'
          : 'border-transparent bg-gray-100 cursor-default opacity-70',
        part.checked && part.enabled ? 'ring-1 ring-primary/20' : '',
      ].join(' ')}
    >
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <div
          className={[
            'size-[22px] rounded-[4px] flex items-center justify-center shrink-0 border transition-colors',
            part.checked ? 'bg-primary border-primary' : 'bg-white border-gray-400',
          ].join(' ')}
        >
          {part.checked && (
            <svg className="size-[14px]" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7l4 4 6-7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Labels */}
        <div>
          <p className="text-gray-900 font-bold text-sm">{part.title}</p>
          <p className="text-gray-400 text-xs">{part.subtitle}</p>
        </div>
      </div>

      {/* Duration badge */}
      <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1.5 rounded-md shrink-0">
        {part.duration} mins
      </span>
    </div>
  );
}

interface Props {
  parts: TestPart[];
  isGeneral: boolean;
  onToggle: (id: string) => void;
}

export default function TestPartsList({ parts, isGeneral, onToggle }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-gray-900 text-xl font-bold tracking-tight">Select Test Parts</h2>
        <span className="text-xs text-gray-400">
          {isGeneral ? 'Select sections to include' : 'Select parts to practise'}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {parts.map((part) => (
          <PartRow key={part.id} part={part} onToggle={onToggle} />
        ))}
      </div>
    </section>
  );
}
