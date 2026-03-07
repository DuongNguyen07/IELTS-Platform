import { ICONS, MODULE_TYPES } from '@/shared/constants';  
import Button from 'client/components/ui/Button';
export default function ContinueLearning({ lesson }) {
  if (!lesson) return null;
  const moduleType = lesson.moduleType?.toLowerCase() || 'general';
  const moduleConfig = MODULE_TYPES[moduleType] || MODULE_TYPES['general'];
   const renderModuleIcon = (type, props = {}) => {
        const config = MODULE_TYPES[type?.toLowerCase()] || MODULE_TYPES['general'];
        const Icon = config.Icon;
        return <Icon {...props} />;
    };  
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-900 text-xl font-bold flex items-center gap-2">
          <ICONS.playCircle className="text-blue-600" />
          Continue Learning
        </h3>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center hover:shadow-xl transition-shadow shadow-sm">
        {/* Video Thumbnail */}
        <div className="w-full md:w-64 aspect-video rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <ICONS.playCircle className="text-blue-600 text-4xl" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <span className="text-teal-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
            {renderModuleIcon(lesson.moduleType, { fontSize: "small" })}
            {lesson.moduleType?.toUpperCase()} MODULE
          </span>
          <h4 className="text-gray-900 text-2xl font-bold mb-4">
            {lesson.lessonTitle}
          </h4>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">{lesson.progressPercent}% Complete</span>
              <span className="text-gray-600">{lesson.timeRemaining} mins remaining</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all" 
                style={{ width: `${lesson.progressPercent}%` }}
              ></div>
            </div>
          </div>

          <Button variant="primary" size="large" fullWidth={false}>
            Resume Lesson →
          </Button>
        </div>
      </div>
    </section>
  );
}