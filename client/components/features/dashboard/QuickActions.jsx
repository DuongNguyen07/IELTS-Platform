import Link from 'next/link';
import { QUICK_ACTIONS, ICONS } from '@/constants';

export default function QuickActions() {
  return (
    <section className="mb-12">
      <h3 className="text-gray-900 text-xl font-bold flex items-center gap-2 mb-6">
        <ICONS.rocket style={{ color: '#2563eb' }} />
        Kickstart Your Practice
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {QUICK_ACTIONS.map((action, index) => {
          const Icon = action.Icon;
          return (
            <div 
              key={index}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: action.bgColor }}
              >
                <Icon style={{ color: action.iconColor }} />
              </div>
              
              <h4 className="text-gray-900 text-lg font-bold mb-2">
                {action.title}
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                {action.description}
              </p>
              
              <Link 
                href={action.link} 
                className="font-semibold text-sm hover:underline"
                style={{ color: action.linkColor }}
              >
                {action.linkText}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}