'use client';

import { useState } from 'react';
import HighlightIcon from '@mui/icons-material/Highlight';
import EditNoteIcon from '@mui/icons-material/EditNote';
import TranslateIcon from '@mui/icons-material/Translate';
interface Tool {
  id: string;
  label: string;
  shortcut: string;
  icon: React.ReactNode;
}

export default function ExamToolsSidebar() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools: Tool[] = [
    { id: 'highlight', label: 'Highlight', shortcut: 'H', icon: <HighlightIcon /> },
    { id: 'notes',     label: 'Notes',     shortcut: 'N', icon: <EditNoteIcon /> },
    { id: 'vocab',     label: 'Vocabulary',shortcut: 'T', icon: <TranslateIcon /> },
  ];

  return (
    <aside className="w-20 bg-exam-bg border-r border-gray-200 flex flex-col items-center py-6 gap-6 flex-shrink-0">
      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Tools</span>
      {tools.map((tool) => {
        const isActive = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => setActiveTool(isActive ? null : tool.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
              isActive
                ? 'bg-success text-white'
                : 'border-2 border-success bg-white text-success group-hover:bg-success group-hover:text-white'
            }`}>
              {tool.icon}
            </div>
            <span className="text-[10px] font-bold text-center text-gray-600 leading-tight">
              {tool.label}<br />
              <span className="text-gray-400">Key ({tool.shortcut})</span>
            </span>
          </button>
        );
      })}
    </aside>
  );
}
