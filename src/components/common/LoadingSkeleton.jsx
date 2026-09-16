export const CourseCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse shadow-xs">
      <div className="h-48 bg-slate-200 w-full" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-slate-200 rounded-full w-24" />
          <div className="h-5 bg-slate-200 rounded-full w-16" />
        </div>
        <div className="h-6 bg-slate-200 rounded w-4/5" />
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="h-4 bg-slate-200 rounded w-20" />
          </div>
          <div className="h-6 bg-slate-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
};

export const StatCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse shadow-xs">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="h-8 bg-slate-200 rounded w-16" />
        </div>
        <div className="w-12 h-12 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
};
