import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import GridViewIcon from '@mui/icons-material/GridView';

import { CATEGORIES, LEVELS, FORMATS } from './constants';
import type { MaterialCategory, MaterialFormat, MaterialLevel } from './types';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  all:        GridViewIcon,
  ebooks:     MenuBookIcon,
  vocabulary: FormatListBulletedIcon,
  grammar:    SpellcheckIcon,
  video:      PlayCircleIcon,
};

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  activeCategory: MaterialCategory | 'all';
  onCategoryChange: (c: MaterialCategory | 'all') => void;
  activeLevels: Set<MaterialLevel>;
  onLevelToggle: (l: MaterialLevel) => void;
  activeFormats: Set<MaterialFormat>;
  onFormatToggle: (f: MaterialFormat) => void;
}

export default function MaterialSidebar({
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  activeLevels,
  onLevelToggle,
  activeFormats,
  onFormatToggle,
}: Props) {
  return (
    <aside className="w-full lg:w-60 shrink-0 flex flex-col gap-7">

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
          <SearchIcon style={{ fontSize: '1.1rem' }} />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search resources..."
          className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* Categories */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
          Categories
        </p>
        <div className="flex flex-col gap-0.5">
          {CATEGORIES.map(({ key, label }) => {
            const Icon = CATEGORY_ICONS[key] ?? MenuBookIcon;
            const active = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => onCategoryChange(key as MaterialCategory | 'all')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon style={{ fontSize: '1.1rem' }} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter by Level */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
          Filter by Level
        </p>
        <div className="flex flex-wrap gap-2 px-3">
          {LEVELS.map(({ key, label }) => {
            const active = activeLevels.has(key);
            return (
              <button
                key={key}
                onClick={() => onLevelToggle(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Format */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
          Format
        </p>
        <div className="flex flex-col gap-2 px-3">
          {FORMATS.map(({ key, label }) => {
            const checked = activeFormats.has(key);
            return (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onFormatToggle(key)}
                  className="rounded border-gray-300 text-primary focus:ring-primary size-4"
                />
                <span className="text-sm text-gray-600">{label}</span>
              </label>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
