import { Activity, CheckCircle2, FileText, BellRing, Award } from 'lucide-react';
import { RECENT_ACTIVITIES } from '../../utils/dummyData';

const iconMap = {
  quiz: CheckCircle2,
  submission: FileText,
  assignment: BellRing,
  certificate: Award
};

const colorMap = {
  quiz: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  submission: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  assignment: 'text-amber-600 bg-amber-50 border-amber-100',
  certificate: 'text-purple-600 bg-purple-50 border-purple-100'
};

const RecentActivities = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">Recent Activities</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Live Feed</span>
      </div>

      <div className="space-y-4">
        {RECENT_ACTIVITIES.map((activity) => {
          const Icon = iconMap[activity.type] || Activity;
          const styling = colorMap[activity.type] || 'text-slate-600 bg-slate-50 border-slate-100';

          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-xl border ${styling} shrink-0 mt-0.5`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 leading-snug">
                  {activity.action}
                </p>
                <p className="text-[11px] text-indigo-600 font-medium truncate mt-0.5">
                  {activity.course}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivities;
