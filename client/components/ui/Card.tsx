import type { SvgIconComponent } from '@mui/icons-material';

interface CardProps {
  Icon?: SvgIconComponent;
  title?: string;
  description?: string;
  iconColor?: 'blue' | 'purple' | 'green' | 'orange' | 'teal' | 'gray';
  className?: string;
}

export default function Card({
  Icon,
  title,
  description,
  iconColor = 'blue',
  className = '',
}: CardProps) {
  const iconColors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    teal: 'bg-teal-100 text-teal-600',
    gray: 'bg-gray-100 text-gray-600',
  };

  const colorClass = iconColors[iconColor] || iconColors.gray;

  return (
    <div className={`flex flex-col gap-6 p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 group ${className}`}>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${colorClass}`}>
        {Icon && <Icon fontSize="large" />}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-gray-900 text-xl font-bold group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
