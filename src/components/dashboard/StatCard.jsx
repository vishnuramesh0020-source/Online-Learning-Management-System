const colorMap = {
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-100',
    ring: 'ring-indigo-500/10'
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
    ring: 'ring-emerald-500/10'
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
    ring: 'ring-amber-500/10'
  },
  sky: {
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    border: 'border-sky-100',
    ring: 'ring-sky-500/10'
  },
  violet: {
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    border: 'border-violet-100',
    ring: 'ring-violet-500/10'
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-100',
    ring: 'ring-rose-500/10'
  }
};

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, color = 'indigo' }) => {
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5 tracking-tight">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                {trend}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">{trendLabel}</span>
            </div>
          )}
        </div>

        <div className={`p-3 rounded-2xl ${c.bg} ${c.text} ${c.border} border ring-4 ${c.ring}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
