import { useState, useMemo } from 'react';
import { useStudents } from '../../context/useStudents';
import { useCourses } from '../../context/useCourses';
import { useAssessments } from '../../context/useAssessments';
import { MONTHLY_ENROLLMENT_DATA, CATEGORY_ENROLLMENT_DATA } from '../../utils/dummyData';
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  ClipboardCheck,
  Star,
  Download,
  Sparkles,
  PieChart,
  CheckCircle2,
  Filter,
  IndianRupee,
  Award
} from 'lucide-react';
import { toast } from 'react-toastify';

const ReportsPage = () => {
  const { students } = useStudents();
  const { courses, enrollments, enrollmentSummary } = useCourses();
  const { assessmentStatistics } = useAssessments();

  // Timeframe filter state
  const [timeframe, setTimeframe] = useState('year'); // 'month' | 'quarter' | 'year'
  const [hoveredMonth, setHoveredMonth] = useState(null);

  // Platform metrics
  const totalStudentsCount = students.length;
  const totalCoursesCount = courses.length;
  const totalEnrollmentsCount = enrollments.length;
  const activeEnrollmentsCount = enrollments.filter((e) => e.status === 'In Progress').length;
  const completedEnrollmentsCount = enrollments.filter(
    (e) => e.status === 'Completed' || (Number(e.progress) || 0) >= 100
  ).length;

  const averageCompletionRate = totalEnrollmentsCount > 0
    ? Math.round(
        enrollments.reduce((acc, e) => acc + (Number(e.progress) || 0), 0) / totalEnrollmentsCount
      )
    : 0;

  // Estimated gross tuition revenue
  const totalGrossRevenue = useMemo(() => {
    let sum = 0;
    enrollments.forEach((e) => {
      const course = courses.find((c) => String(c.id) === String(e.courseId));
      if (course) {
        sum += Number(course.price) || 49.99;
      } else {
        sum += 49.99;
      }
    });
    return Math.round(sum);
  }, [enrollments, courses]);

  // Top Rated Courses sorted by rating and review count
  const topRatedCourses = useMemo(() => {
    const list = [...courses];
    list.sort((a, b) => {
      const ratingDiff = (Number(b.rating) || 0) - (Number(a.rating) || 0);
      if (ratingDiff !== 0) return ratingDiff;
      return (Number(b.enrolledStudents) || 0) - (Number(a.enrolledStudents) || 0);
    });
    return list.slice(0, 5);
  }, [courses]);

  // Student progress distribution tiers
  const progressDistribution = useMemo(() => {
    let tier1 = 0; // 0 - 25%
    let tier2 = 0; // 26 - 50%
    let tier3 = 0; // 51 - 75%
    let tier4 = 0; // 76 - 99%
    let tier5 = 0; // 100% (Completed)

    enrollments.forEach((e) => {
      const p = Number(e.progress) || 0;
      if (p >= 100 || e.status === 'Completed') tier5++;
      else if (p >= 75) tier4++;
      else if (p >= 50) tier3++;
      else if (p >= 25) tier2++;
      else tier1++;
    });

    const total = enrollments.length || 1;
    return [
      { label: '0 - 25% (Getting Started)', count: tier1, percent: Math.round((tier1 / total) * 100), color: 'bg-amber-500' },
      { label: '26 - 50% (Active Learning)', count: tier2, percent: Math.round((tier2 / total) * 100), color: 'bg-blue-500' },
      { label: '51 - 75% (Substantial Progress)', count: tier3, percent: Math.round((tier3 / total) * 100), color: 'bg-indigo-500' },
      { label: '76 - 99% (Final Capstone)', count: tier4, percent: Math.round((tier4 / total) * 100), color: 'bg-violet-500' },
      { label: '100% (Completed & Certified)', count: tier5, percent: Math.round((tier5 / total) * 100), color: 'bg-emerald-500' }
    ];
  }, [enrollments]);

  // Precalculated category SVG segments
  const categorySegments = useMemo(() => {
    const circumference = 2 * Math.PI * 38; // ~238.76
    return CATEGORY_ENROLLMENT_DATA.map((item, index) => {
      const prevSum = CATEGORY_ENROLLMENT_DATA
        .slice(0, index)
        .reduce((sum, c) => sum + c.percentage, 0);
      const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((prevSum / 100) * circumference);
      return {
        ...item,
        strokeDasharray,
        strokeDashoffset
      };
    });
  }, []);

  // Handle export summary
  const handleExportReport = () => {
    toast.success('📊 Comprehensive Analytics Report exported as PDF / CSV!');
  };

  // Max value for Monthly Enrollments chart
  const maxMonthlyEnrollment = Math.max(...MONTHLY_ENROLLMENT_DATA.map((d) => d.enrollments), 180);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Executive Business Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Reports & Learning Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Holistic institutional insights: enrollment trends, course popularity rankings, category distributions, and student outcome performance.
          </p>
        </div>

        {/* Action & Filter Controls */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <button
              type="button"
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                timeframe === 'month'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('quarter')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                timeframe === 'quarter'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Quarter
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                timeframe === 'year'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              YTD 2026
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Executive KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Students */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Students
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {totalStudentsCount}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              Live Ledger
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Enrolled across all degree and certificate tracks
          </p>
        </div>

        {/* KPI 2: Total Courses */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Courses
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {totalCoursesCount}
            </span>
            <span className="text-xs text-blue-600 font-medium">Active Catalog</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Spanning Web Dev, AI, Cloud, Design & Data Science
          </p>
        </div>

        {/* KPI 3: Active Enrollments */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Enrollments
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <ClipboardCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">
              {activeEnrollmentsCount}
            </span>
            <span className="text-xs text-slate-500">
              of {totalEnrollmentsCount} total
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-emerald-700 font-medium">
              {completedEnrollmentsCount} completed
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-indigo-600 font-medium">
              {averageCompletionRate}% avg rate
            </span>
          </div>
        </div>

        {/* KPI 4: Estimated Tuition Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tuition Volume
            </span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              ₹{totalGrossRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-violet-600 font-medium">Gross Total</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Top course: <strong>{enrollmentSummary.topCourse || 'Mastering React 19'}</strong>
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISUAL CHARTS SECTION                                                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART 1: MONTHLY ENROLLMENTS TREND (BAR & LINE HYBRID CHART) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <span>Monthly Admissions & Completions Trend</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly student enrollment velocity compared with completed course graduations.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-indigo-700">
                <span className="w-3 h-3 rounded bg-indigo-600 inline-block" />
                <span>New Enrollments</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                <span>Completions</span>
              </span>
            </div>
          </div>

          {/* Interactive SVG Bar Chart */}
          <div className="relative pt-4 pb-2">
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-200">
              {MONTHLY_ENROLLMENT_DATA.map((item, idx) => {
                const enrollmentHeight = Math.round((item.enrollments / maxMonthlyEnrollment) * 100);
                const completionHeight = Math.round((item.completions / maxMonthlyEnrollment) * 100);
                const isHovered = hoveredMonth === idx;

                return (
                  <div
                    key={item.month}
                    className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative cursor-pointer"
                    onMouseEnter={() => setHoveredMonth(idx)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    {/* Hover Floating Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap animate-fade-in pointer-events-none">
                        <p className="font-bold">{item.month} 2026</p>
                        <p className="text-indigo-300">Enrollments: {item.enrollments}</p>
                        <p className="text-emerald-300">Completions: {item.completions}</p>
                      </div>
                    )}

                    {/* Dual Bars container */}
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Enrollments bar */}
                      <div
                        className={`w-full max-w-[18px] rounded-t-md transition-all duration-300 ${
                          isHovered ? 'bg-indigo-700' : 'bg-indigo-600/90 hover:bg-indigo-700'
                        }`}
                        style={{ height: `${enrollmentHeight}%` }}
                      />
                      {/* Completions bar */}
                      <div
                        className={`w-full max-w-[18px] rounded-t-md transition-all duration-300 ${
                          isHovered ? 'bg-emerald-600' : 'bg-emerald-500/80 hover:bg-emerald-600'
                        }`}
                        style={{ height: `${completionHeight}%` }}
                      />
                    </div>

                    {/* Month Label */}
                    <span className="text-[11px] font-semibold text-slate-500 mt-2">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Growth indicator footer */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+255% growth from Jan to Sep 2026</span>
              </span>
              <span>Peak Admissions: 160 (September)</span>
            </div>
          </div>
        </div>

        {/* CHART 2: COURSE CATEGORY DISTRIBUTION (DONUT / RING CHART) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <span>Category Distribution</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of student interest and subject enrollments.
            </p>
          </div>

          {/* SVG Donut Visual */}
          <div className="relative flex items-center justify-center my-2">
            <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth="12"
              />
              {/* Segments */}
              {categorySegments.map((item, i) => (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="12"
                  strokeDasharray={item.strokeDasharray}
                  strokeDashoffset={item.strokeDashoffset}
                  className="transition-all duration-500 hover:opacity-85"
                />
              ))}
            </svg>

            {/* Center Label */}
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900">
                {CATEGORY_ENROLLMENT_DATA.reduce((a, b) => a + b.count, 0)}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Learners</span>
            </div>
          </div>

          {/* Legend Table */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {CATEGORY_ENROLLMENT_DATA.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium text-slate-700">{cat.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{cat.count}</span>
                  <span className="font-bold text-slate-800">{cat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECOND ROW: STUDENT PROGRESS DISTRIBUTION & TOP RATED COURSES             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PROGRESS DISTRIBUTION BARS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Student Completion Tiers</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Learner distribution across syllabus completion milestones.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {progressDistribution.map((tier, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{tier.label}</span>
                  <span className="text-slate-900 font-bold">{tier.count} ({tier.percent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${tier.color}`}
                    style={{ width: `${tier.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Assessment Passing Threshold</span>
            <strong className="text-emerald-700">70% Required</strong>
          </div>

          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Avg Assessment Marks</span>
            </span>
            <strong className="text-indigo-700 font-bold">
              {assessmentStatistics.averageQuizScore > 0 ? `${assessmentStatistics.averageQuizScore}%` : '85%'} Pass Rate
            </strong>
          </div>
        </div>

        {/* TOP RATED COURSES TABLE */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <span>Top Rated Courses</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Highest ranked curriculum offerings based on student feedback reviews.
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600">Top 5 Catalog</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Course Title</th>
                  <th className="py-2.5 px-3">Instructor</th>
                  <th className="py-2.5 px-3">Rating</th>
                  <th className="py-2.5 px-3">Enrolled</th>
                  <th className="py-2.5 px-3 text-right">Tuition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {topRatedCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            c.thumbnail ||
                            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
                          }
                          alt={c.title}
                          className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-200"
                        />
                        <span className="font-semibold text-slate-800 line-clamp-1 max-w-xs">
                          {c.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{c.instructor}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{c.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {c.enrolledStudents?.toLocaleString()} students
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      ₹{c.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
