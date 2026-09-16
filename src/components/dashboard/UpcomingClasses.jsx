import { Calendar, Clock, Video, User } from 'lucide-react';
import { UPCOMING_CLASSES } from '../../utils/dummyData';
import { toast } from 'react-toastify';

const UpcomingClasses = () => {
  const handleJoin = (title) => {
    toast.info(`Connecting to live virtual classroom: "${title}"...`);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">Upcoming Classes</h3>
        </div>
        <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
          {UPCOMING_CLASSES.length} Scheduled
        </span>
      </div>

      <div className="space-y-3">
        {UPCOMING_CLASSES.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 transition-all group"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100/80 text-indigo-800 px-2 py-0.5 rounded-md">
                {item.badge}
              </span>
              <span className="text-xs font-semibold text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-slate-200/60">
                {item.date}
              </span>
            </div>

            <h4 className="font-semibold text-slate-800 text-sm mt-2 group-hover:text-indigo-600 transition-colors">
              {item.title}
            </h4>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.instructor}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.time}</span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex justify-end">
              <button
                type="button"
                onClick={() => handleJoin(item.title)}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg shadow-xs shadow-indigo-600/20 transition-all"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join Class</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingClasses;
