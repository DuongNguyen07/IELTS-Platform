export default function Card({
  Icon,
  title,
  description,
  iconColor = 'blue',
  className = '',
}) {
  const iconColors = {
    blue: 'bg-blue-100 text-blue-600',
    teal: 'bg-teal-100 text-teal-600',
  };

  return (
    <div className={`flex flex-col gap-6 p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-shadow group ${className}`}>
      
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors group-hover:bg-blue-600 group-hover:text-white ${iconColors[iconColor]}`}>
        {Icon && <Icon fontSize="medium" />}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-gray-900 text-xl font-bold">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
