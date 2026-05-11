import Image from 'next/image';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import StarRating from './StarRating';
import { SKILL_CONFIG, SKILL_IMAGE } from './constants';
import type { MaterialItem} from './types';

interface Props {
  item: MaterialItem;
}

export default function MaterialCard({ item }: Props) {
  const cfg = SKILL_CONFIG[item.skill];
  const imageSrc = SKILL_IMAGE[item.skill];

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col">

      {/* Thumbnail */}
      <div className="aspect-[4/3] w-full relative overflow-hidden">
        <Image
          src={imageSrc}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover overlay with action buttons */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 z-10">
          <button className="p-2.5 bg-white rounded-full text-gray-900 shadow-lg hover:scale-110 transition-transform">
            <VisibilityIcon style={{ fontSize: '1.1rem' }} />
          </button>
          <button className="p-2.5 bg-primary rounded-full text-white shadow-lg hover:scale-110 transition-transform">
            <DownloadIcon style={{ fontSize: '1.1rem' }} />
          </button>
        </div>

        {/* Format badge */}
        <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
          {item.format} • {item.fileSize}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Skill badge + rating */}
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-bold uppercase tracking-tight px-2 py-0.5 rounded ${cfg.badgeBg} ${cfg.badgeText}`}>
            {cfg.label}
          </span>
          <StarRating rating={item.rating} />
        </div>

        {/* Title */}
        <h3 className="font-bold text-base leading-snug text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>

        {/* Actions */}
        <div className="pt-1 mt-auto flex items-center justify-between">
          <button className="text-primary text-sm font-semibold flex items-center gap-1 group/btn">
            {item.actionType === 'watch' ? 'Watch Now' : item.actionType === 'view' ? 'View Details' : 'View Details'}
            {item.actionType === 'watch'
              ? <PlayArrowIcon style={{ fontSize: '1rem' }} className="group-hover/btn:translate-x-0.5 transition-transform" />
              : <ArrowForwardIcon style={{ fontSize: '1rem' }} className="group-hover/btn:translate-x-0.5 transition-transform" />
            }
          </button>

          <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors">
            {item.actionType === 'watch'
              ? <BookmarkBorderIcon style={{ fontSize: '1.1rem' }} />
              : <DownloadIcon style={{ fontSize: '1.1rem' }} />
            }
          </button>
        </div>
      </div>
    </div>
  );
}
