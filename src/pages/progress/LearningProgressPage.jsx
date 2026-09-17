import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '../../context/useCourses';
import { useStudents } from '../../context/useStudents';
import Pagination from '../../components/common/Pagination';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  User,
  Search,
  Filter,
  Sparkles,
  ChevronRight,
  GraduationCap,
  ListChecks,
  RefreshCw,
  CheckCheck,
  BarChart3,
  ExternalLink,
  Calendar
} from 'lucide-react';

const LearningProgressPage = () => {
  const {
    enrollments,
    courses,
    getCourseModules,
    toggleLessonCompletion,
    markAllLessonsCompleted,
    resetEnrollmentProgress,
    learningProgressStatistics
  } = useCourses();

  const { students } = useStudents();

  // Active view: 'student' (Student-wise Progress) or 'roster' (All Learners Overview)
  const [activeTab, setActiveTab] = useState('student');

  // Selected student ID for student-wise view (null means default to first available)
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Search & Filters for Student-wise tab
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  // Search & Filters for All Learners Roster tab
  const [rosterSearch, setRosterSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [progressThreshold, setProgressThreshold] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [sortBy, setSortBy] = useState('progress-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Derived effective student ID
  const effectiveStudentId = useMemo(() => {
    if (selectedStudentId) return selectedStudentId;
    if (enrollments.length > 0) return String(enrollments[0].studentId);
    if (students.length > 0) return String(students[0].id);
    return '';
  }, [selectedStudentId, enrollments, students]);

  // Unique list of students who have enrollments
  const enrolledStudentsList = useMemo(() => {
    const studentMap = new Map();

    // First, populate students from StudentContext
    students.forEach((s) => {
      studentMap.set(String(s.id), {
        id: String(s.id),
        name: s.name,
        email: s.email,
        qualification: s.qualification || 'Enrolled Student',
        avatar: s.avatar || s.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(s.name)}`,
        enrollmentDate: s.enrollmentDate || '2026-08-01',
        enrollmentCount: 0
      });
    });

    // Then, map enrollments to tally count and ensure any student in enrollments is present
    enrollments.forEach((e) => {
      const sId = String(e.studentId);
      if (studentMap.has(sId)) {
        const item = studentMap.get(sId);
        item.enrollmentCount = (item.enrollmentCount || 0) + 1;
      } else {
        studentMap.set(sId, {
          id: sId,
          name: e.studentName || `Student #${sId}`,
          email: e.studentEmail || 'student@educationpro.com',
          qualification: 'Enrolled Learner',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(e.studentName || sId)}`,
          enrollmentDate: e.enrollmentDate || '2026-08-01',
          enrollmentCount: 1
        });
      }
    });

    return Array.from(studentMap.values());
  }, [students, enrollments]);

  // Filtered students for student picker list
  const filteredStudents = useMemo(() => {
    if (!studentSearchQuery.trim()) return enrolledStudentsList;
    const q = studentSearchQuery.toLowerCase().trim();
    return enrolledStudentsList.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.qualification.toLowerCase().includes(q)
    );
  }, [enrolledStudentsList, studentSearchQuery]);

  // Currently selected student object
  const currentStudent = useMemo(() => {
    return (
      enrolledStudentsList.find((s) => String(s.id) === String(effectiveStudentId)) ||
      enrolledStudentsList[0] ||
      null
    );
  }, [enrolledStudentsList, effectiveStudentId]);

  // Enrollments for the currently selected student
  const currentStudentEnrollments = useMemo(() => {
    if (!currentStudent) return [];
    return enrollments.filter((e) => String(e.studentId) === String(currentStudent.id));
  }, [enrollments, currentStudent]);

  // Aggregated progress stats for selected student
  const studentStats = useMemo(() => {
    if (!currentStudentEnrollments.length) {
      return {
        totalCourses: 0,
        averageProgress: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        completedLessons: 0,
        pendingLessons: 0,
        totalLessons: 0
      };
    }

    let progressSum = 0;
    let completedCourses = 0;
    let completedLessons = 0;
    let totalLessons = 0;

    currentStudentEnrollments.forEach((e) => {
      const prog = Number(e.progress) || 0;
      progressSum += prog;
      if (prog >= 100 || e.status === 'Completed') {
        completedCourses++;
      }
      const modules = getCourseModules(e.courseId);
      const cLessons = Array.isArray(e.completedLessons)
        ? e.completedLessons
        : modules.slice(0, Math.round((prog / 100) * modules.length));

      completedLessons += cLessons.length;
      totalLessons += modules.length;
    });

    const averageProgress = Math.round(progressSum / currentStudentEnrollments.length);
    const pendingLessons = Math.max(0, totalLessons - completedLessons);

    return {
      totalCourses: currentStudentEnrollments.length,
      averageProgress,
      completedCourses,
      inProgressCourses: currentStudentEnrollments.length - completedCourses,
      completedLessons,
      pendingLessons,
      totalLessons
    };
  }, [currentStudentEnrollments, getCourseModules]);

  // Filtered enrollments for All Learners Roster tab
  const filteredRosterEnrollments = useMemo(() => {
    let list = [...enrollments];

    // Search query
    if (rosterSearch.trim()) {
      const q = rosterSearch.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.studentName?.toLowerCase().includes(q) ||
          e.studentEmail?.toLowerCase().includes(q) ||
          e.courseTitle?.toLowerCase().includes(q) ||
          e.instructor?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      list = list.filter((e) => e.status === statusFilter);
    }

    // Course filter
    if (courseFilter !== 'All') {
      list = list.filter((e) => String(e.courseId) === String(courseFilter));
    }

    // Progress threshold
    if (progressThreshold === '<50') {
      list = list.filter((e) => (Number(e.progress) || 0) < 50);
    } else if (progressThreshold === '>=50') {
      list = list.filter((e) => (Number(e.progress) || 0) >= 50 && (Number(e.progress) || 0) < 100);
    } else if (progressThreshold === '100') {
      list = list.filter((e) => (Number(e.progress) || 0) >= 100);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'progress-desc') {
        return (Number(b.progress) || 0) - (Number(a.progress) || 0);
      }
      if (sortBy === 'progress-asc') {
        return (Number(a.progress) || 0) - (Number(b.progress) || 0);
      }
      if (sortBy === 'name-asc') {
        return (a.studentName || '').localeCompare(b.studentName || '');
      }
      if (sortBy === 'course-asc') {
        return (a.courseTitle || '').localeCompare(b.courseTitle || '');
      }
      return 0;
    });

    return list;
  }, [enrollments, rosterSearch, statusFilter, courseFilter, progressThreshold, sortBy]);

  // Roster Pagination
  const totalRosterPages = Math.max(1, Math.ceil(filteredRosterEnrollments.length / itemsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalRosterPages);
  const paginatedRoster = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return filteredRosterEnrollments.slice(start, start + itemsPerPage);
  }, [filteredRosterEnrollments, safeCurrentPage, itemsPerPage]);

  // Color helper for progress indicators
  const getProgressColor = (percent) => {
    if (percent >= 100) {
      return {
        bar: 'bg-emerald-500',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800'
      };
    }
    if (percent >= 70) {
      return {
        bar: 'bg-indigo-600',
        text: 'text-indigo-700',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        badge: 'bg-indigo-100 text-indigo-800'
      };
    }
    if (percent >= 40) {
      return {
        bar: 'bg-blue-600',
        text: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-800'
      };
    }
    return {
      bar: 'bg-amber-500',
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800'
    };
  };

  // Inspect student from roster table
  const handleInspectStudent = (studentId) => {
    setSelectedStudentId(String(studentId));
    setActiveTab('student');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Curriculum Mastery & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Learning Progress Tracking
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor course completion percentages, inspect completed and pending lessons, and evaluate student performance in real-time.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Student-wise Progress</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>All Learners Overview</span>
          </button>
        </div>
      </div>

      {/* Global Statistics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Average Completion Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Avg Completion Rate
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {learningProgressStatistics.averageCompletionRate}%
            </span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <Sparkles className="w-3 h-3 mr-0.5" />
              Live Rate
            </span>
          </div>
          {/* Visual Mini Progress Bar */}
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${learningProgressStatistics.averageCompletionRate}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Calculated across {learningProgressStatistics.totalEnrollments} active course enrollments
          </p>
        </div>

        {/* KPI 2: Completed Lessons */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Completed Lessons
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {learningProgressStatistics.totalCompletedLessons}
            </span>
            <span className="text-xs text-slate-500">lessons finished</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-700"
              style={{
                width: `${
                  learningProgressStatistics.totalLessons
                    ? Math.round((learningProgressStatistics.totalCompletedLessons / learningProgressStatistics.totalLessons) * 100)
                    : 0
                }%`
              }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Out of {learningProgressStatistics.totalLessons} total assigned curriculum lessons
          </p>
        </div>

        {/* KPI 3: Pending Lessons */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Lessons
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {learningProgressStatistics.totalPendingLessons}
            </span>
            <span className="text-xs text-amber-600 font-medium">to be finished</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-700"
              style={{
                width: `${
                  learningProgressStatistics.totalLessons
                    ? Math.round((learningProgressStatistics.totalPendingLessons / learningProgressStatistics.totalLessons) * 100)
                    : 0
                }%`
              }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {learningProgressStatistics.inProgressCount} courses currently in progress
          </p>
        </div>

        {/* KPI 4: Completed Certificates */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Courses Completed
            </span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {learningProgressStatistics.completedCertificates}
            </span>
            <span className="text-xs text-violet-600 font-medium">100% completed</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>{learningProgressStatistics.highAchieversCount} learners with ≥ 80% progress</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Eligible for course completion certifications
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: STUDENT-WISE PROGRESS VIEW                                        */}
      {/* ========================================================================= */}
      {activeTab === 'student' && (
        <div className="space-y-8">
          {/* Student Selector Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  <span>Select Student to Track</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose a student to view course completion percentage, inspect lesson checklists, and update progress.
                </p>
              </div>

              {/* Student Quick Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter student list..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Horizontally scrollable / grid student pill roster */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-1">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((stu) => {
                  const isSelected = String(stu.id) === String(effectiveStudentId);
                  return (
                    <button
                      key={stu.id}
                      type="button"
                      onClick={() => setSelectedStudentId(String(stu.id))}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-400/80 shadow-xs ring-2 ring-indigo-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <img
                        src={stu.avatar}
                        alt={stu.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(stu.name)}`;
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold truncate ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                          {stu.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{stu.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              stu.enrollmentCount > 0
                                ? 'bg-indigo-100/70 text-indigo-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {stu.enrollmentCount} {stu.enrollmentCount === 1 ? 'course' : 'courses'}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full py-6 text-center text-xs text-slate-400">
                  No students found matching "{studentSearchQuery}".
                </div>
              )}
            </div>
          </div>

          {/* Selected Student Active Profile & Overall Progress Header */}
          {currentStudent && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left: Avatar & Info */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                  <div className="relative shrink-0">
                    <img
                      src={currentStudent.avatar}
                      alt={currentStudent.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-400/40 shadow-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentStudent.name)}`;
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-full border border-slate-900 shadow">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                        {currentStudent.name}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
                        {currentStudent.qualification}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm mt-1">{currentStudent.email}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Enrolled on {currentStudent.enrollmentDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Student Overall Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl self-stretch md:self-auto">
                  <div className="text-center p-2">
                    <p className="text-xs text-slate-400">Enrolled</p>
                    <p className="text-xl font-bold text-white mt-0.5">
                      {studentStats.totalCourses}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Courses</p>
                  </div>
                  <div className="text-center p-2 border-l border-white/10">
                    <p className="text-xs text-slate-400">Avg Progress</p>
                    <p className="text-xl font-bold text-indigo-300 mt-0.5">
                      {studentStats.averageProgress}%
                    </p>
                    <p className="text-[10px] text-indigo-200/60 mt-0.5">Overall rate</p>
                  </div>
                  <div className="text-center p-2 border-l border-white/10">
                    <p className="text-xs text-slate-400">Lessons Done</p>
                    <p className="text-xl font-bold text-emerald-400 mt-0.5">
                      {studentStats.completedLessons}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">of {studentStats.totalLessons}</p>
                  </div>
                  <div className="text-center p-2 border-l border-white/10">
                    <p className="text-xs text-slate-400">Pending</p>
                    <p className="text-xl font-bold text-amber-300 mt-0.5">
                      {studentStats.pendingLessons}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Lessons left</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Student's Enrolled Courses Progress Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span>Enrolled Courses Curriculum & Progress</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Interactive curriculum checklist. Check or uncheck modules to dynamically recalculate completion percentage.
                </p>
              </div>

              {currentStudentEnrollments.length > 0 && (
                <span className="text-xs text-slate-500 font-medium">
                  Showing {currentStudentEnrollments.length} {currentStudentEnrollments.length === 1 ? 'course' : 'courses'}
                </span>
              )}
            </div>

            {currentStudentEnrollments.length > 0 ? (
              <div className="space-y-6">
                {currentStudentEnrollments.map((enrollment) => {
                  const courseModules = getCourseModules(enrollment.courseId);
                  const completedLessons = Array.isArray(enrollment.completedLessons)
                    ? enrollment.completedLessons
                    : courseModules.slice(0, Math.round(((Number(enrollment.progress) || 0) / 100) * courseModules.length));

                  const totalLessonsCount = courseModules.length;
                  const completedCount = completedLessons.length;
                  const pendingCount = Math.max(0, totalLessonsCount - completedCount);
                  const progressPercentage = Number(enrollment.progress) || 0;
                  const colors = getProgressColor(progressPercentage);
                  const isCompleted = progressPercentage >= 100 || enrollment.status === 'Completed';

                  return (
                    <div
                      key={enrollment.id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 space-y-6"
                    >
                      {/* Course Card Top Row */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Course Thumbnail & Meta */}
                        <div className="flex items-start sm:items-center gap-4">
                          <img
                            src={
                              enrollment.courseThumbnail ||
                              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
                            }
                            alt={enrollment.courseTitle}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs"
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  isCompleted
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                }`}
                              >
                                {isCompleted ? 'Completed' : 'In Progress'}
                              </span>
                              <span className="text-xs text-slate-400">
                                Enrolled {enrollment.enrollmentDate}
                              </span>
                            </div>
                            <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                              {enrollment.courseTitle}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Instructor: <span className="font-medium text-slate-700">{enrollment.instructor}</span>
                            </p>
                          </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                          <button
                            type="button"
                            onClick={() => markAllLessonsCompleted(enrollment.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                            title="Mark all lessons as completed"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Mark 100%</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => resetEnrollmentProgress(enrollment.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Reset all lessons to 0%"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Reset</span>
                          </button>
                          <Link
                            to={`/courses/${enrollment.courseId}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            <span>View Course</span>
                          </Link>
                        </div>
                      </div>

                      {/* Course Completion Progress Bar Section */}
                      <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 sm:p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Course Progress
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${colors.badge}`}>
                              {progressPercentage}% Completed
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs font-medium">
                            <span className="text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{completedCount} Completed</span>
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-amber-700 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>{pendingCount} Pending</span>
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500">
                              Total: {totalLessonsCount} Lessons
                            </span>
                          </div>
                        </div>

                        {/* Large Animated Progress Bar */}
                        <div className="w-full bg-slate-200/80 h-3 rounded-full overflow-hidden relative shadow-inner">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ease-out ${colors.bar}`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Interactive Curriculum Lessons Checklist */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <ListChecks className="w-4 h-4 text-indigo-600" />
                            <span>Curriculum Lessons Checklist ({completedCount}/{totalLessonsCount})</span>
                          </h5>
                          <span className="text-[11px] text-slate-400">
                            Click checkbox to mark lesson completed or pending
                          </span>
                        </div>

                        <div className="grid grid-cols-1 divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                          {courseModules.map((moduleTitle, idx) => {
                            const isLessonFinished = completedLessons.includes(moduleTitle);

                            return (
                              <label
                                key={idx}
                                className={`flex items-center justify-between p-3 sm:px-4 text-xs sm:text-sm cursor-pointer transition-colors ${
                                  isLessonFinished
                                    ? 'bg-emerald-50/30 hover:bg-emerald-50/60'
                                    : 'hover:bg-slate-50/80'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0 pr-4">
                                  <input
                                    type="checkbox"
                                    checked={isLessonFinished}
                                    onChange={(e) =>
                                      toggleLessonCompletion(enrollment.id, moduleTitle, e.target.checked)
                                    }
                                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <span className="text-[11px] font-semibold text-slate-400 mr-2 uppercase">
                                      Lesson 0{idx + 1}
                                    </span>
                                    <span
                                      className={`font-medium ${
                                        isLessonFinished
                                          ? 'text-slate-800 line-through text-slate-500'
                                          : 'text-slate-900'
                                      }`}
                                    >
                                      {moduleTitle}
                                    </span>
                                  </div>
                                </div>

                                <div className="shrink-0">
                                  {isLessonFinished ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Done</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>Pending</span>
                                    </span>
                                  )}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State: Student Not Enrolled in Any Course */
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  No Course Enrollments Found for {currentStudent.name}
                </h4>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  This student has not yet enrolled in any curriculum courses. You can enroll them via the Course Admissions & Enrollment module.
                </p>
                <div className="pt-2">
                  <Link
                    to="/enrollments"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs transition-colors"
                  >
                    <span>Enroll Student in a Course</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ALL LEARNERS OVERVIEW (GLOBAL ROSTER TABLE)                       */}
      {/* ========================================================================= */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by student name, email, course title, or instructor..."
                  value={rosterSearch}
                  onChange={(e) => {
                    setRosterSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Filters Group */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Status Filter */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="All">All Statuses</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Progress Band Filter */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span>Progress:</span>
                  <select
                    value={progressThreshold}
                    onChange={(e) => {
                      setProgressThreshold(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="All">All Ranges</option>
                    <option value="<50">&lt; 50% Progress</option>
                    <option value=">=50">50% - 99% Progress</option>
                    <option value="100">100% Completed</option>
                  </select>
                </div>

                {/* Course Filter */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span>Course:</span>
                  <select
                    value={courseFilter}
                    onChange={(e) => {
                      setCourseFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium max-w-[160px] truncate focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="All">All Courses</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span>Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="progress-desc">Highest Progress</option>
                    <option value="progress-asc">Lowest Progress</option>
                    <option value="name-asc">Student Name (A-Z)</option>
                    <option value="course-asc">Course Title (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count & Reset */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <span>
                Found <strong className="text-slate-800">{filteredRosterEnrollments.length}</strong> enrolled learning records
              </span>
              {(rosterSearch || statusFilter !== 'All' || progressThreshold !== 'All' || courseFilter !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setRosterSearch('');
                    setStatusFilter('All');
                    setProgressThreshold('All');
                    setCourseFilter('All');
                    setSortBy('progress-desc');
                    setCurrentPage(1);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Student Learner</th>
                    <th className="py-3.5 px-6">Enrolled Course</th>
                    <th className="py-3.5 px-6">Completion %</th>
                    <th className="py-3.5 px-6">Curriculum Progress</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedRoster.length > 0 ? (
                    paginatedRoster.map((item) => {
                      const modules = getCourseModules(item.courseId);
                      const cLessons = Array.isArray(item.completedLessons)
                        ? item.completedLessons
                        : modules.slice(0, Math.round(((Number(item.progress) || 0) / 100) * modules.length));

                      const completedCount = cLessons.length;
                      const pendingCount = Math.max(0, modules.length - completedCount);
                      const prog = Number(item.progress) || 0;
                      const colors = getProgressColor(prog);
                      const isComplete = prog >= 100 || item.status === 'Completed';

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Student */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.studentName)}`}
                                alt={item.studentName}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <p className="font-semibold text-slate-900">{item.studentName}</p>
                                <p className="text-xs text-slate-400">{item.studentEmail}</p>
                              </div>
                            </div>
                          </td>

                          {/* Course */}
                          <td className="py-4 px-6 max-w-xs">
                            <p className="font-semibold text-slate-800 line-clamp-1">{item.courseTitle}</p>
                            <p className="text-xs text-slate-400">Instructor: {item.instructor}</p>
                          </td>

                          {/* Completion % with Mini Bar */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2.5">
                              <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${colors.bar}`}
                                  style={{ width: `${prog}%` }}
                                />
                              </div>
                              <span className={`text-xs font-bold ${colors.text}`}>
                                {prog}%
                              </span>
                            </div>
                          </td>

                          {/* Lessons Stats */}
                          <td className="py-4 px-6">
                            <div className="text-xs font-medium space-y-0.5">
                              <p className="text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{completedCount} Completed</span>
                              </p>
                              <p className="text-slate-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-amber-500" />
                                <span>{pendingCount} Pending</span>
                              </p>
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                isComplete
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              }`}
                            >
                              {isComplete && <CheckCircle2 className="w-3.5 h-3.5" />}
                              <span>{isComplete ? 'Completed' : 'In Progress'}</span>
                            </span>
                          </td>

                          {/* Action Button */}
                          <td className="py-4 px-6 text-right">
                            <button
                              type="button"
                              onClick={() => handleInspectStudent(item.studentId)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <span>Inspect Checklist</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                        No learner progress records match the current filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalRosterPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-100">
                <Pagination
                  currentPage={safeCurrentPage}
                  totalPages={totalRosterPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningProgressPage;
