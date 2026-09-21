import { useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useCourses } from '../../context/useCourses';
import { useStudents } from '../../context/useStudents';
import { useInstructors } from '../../context/useInstructors';
import StatCard from '../../components/dashboard/StatCard';
import UpcomingClasses from '../../components/dashboard/UpcomingClasses';
import RecentActivities from '../../components/dashboard/RecentActivities';
import QuickActions from '../../components/dashboard/QuickActions';
import {
  BookOpen,
  Users,
  GraduationCap,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  PlayCircle
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const { courses, enrolledCourseIds, enrollments } = useCourses();
  const { students } = useStudents();
  const { instructors } = useInstructors();
  const { handleOpenAddCourse } = useOutletContext() || {};

  // Compute metrics dynamically from registered database collections
  const totalCourses = courses.length;
  const totalInstructors = instructors.length;
  const totalStudentsCount = students.length;
  const enrolledCount = enrolledCourseIds.length;
  const completedCount = enrollments.filter((e) => e.status === 'Completed').length;

  // Enrolled courses details
  const enrolledCourses = courses.filter((c) =>
    enrolledCourseIds.some((id) => String(id) === String(c.id))
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 p-6 sm:p-8 text-white shadow-xl overflow-hidden">
        {/* Background decorative patterns */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-violet-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-indigo-100 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Learning Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Welcome back, {user?.name || 'Scholar'}!
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 mt-2 leading-relaxed">
            You have made great progress this week. You have{' '}
            <span className="font-semibold text-white underline">{enrolledCount} active courses</span> and 1 upcoming live workshop today.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-indigo-50 shadow-md transition-all"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/progress"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 backdrop-blur-sm transition-all"
            >
              <span>Resume Learning</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 5 Key Metric Cards (Total Courses, Total Students, Total Instructors, Enrolled Courses, Completed Courses) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Courses"
          value={totalCourses}
          icon={BookOpen}
          trend="+3 New"
          trendLabel="this month"
          color="indigo"
        />
        <StatCard
          title="Total Students"
          value={totalStudentsCount.toLocaleString()}
          icon={Users}
          trend="+12.4%"
          trendLabel="growth"
          color="emerald"
        />
        <StatCard
          title="Total Instructors"
          value={totalInstructors}
          icon={GraduationCap}
          trend="Faculty"
          trendLabel="verified"
          color="violet"
        />
        <StatCard
          title="Enrolled Courses"
          value={enrolledCount}
          icon={Clock}
          trend="In Progress"
          trendLabel="active"
          color="sky"
        />
        <StatCard
          title="Completed Courses"
          value={completedCount}
          icon={CheckCircle}
          trend="100%"
          trendLabel="certified"
          color="amber"
        />
      </div>

      {/* Quick Action Cards */}
      <QuickActions onOpenAddCourse={handleOpenAddCourse} />

      {/* Active Courses In Progress */}
      {enrolledCourses.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Continue Learning</h3>
              <p className="text-xs text-slate-500 mt-0.5">Jump back into your active course modules</p>
            </div>
            <Link
              to="/progress"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCourses.slice(0, 2).map((course, idx) => {
              const progress = idx === 0 ? 68 : 42;
              return (
                <div
                  key={course.id}
                  className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all group"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full sm:w-28 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0 w-full">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {course.category}
                    </span>
                    <h4 className="font-semibold text-sm text-slate-800 truncate mt-1 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h4>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Progress</span>
                        <span className="font-semibold text-slate-700">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Link
                        to={`/courses/${course.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Resume Lesson</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid: Upcoming Classes & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <UpcomingClasses />
        </div>
        <div className="lg:col-span-6">
          <RecentActivities />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
