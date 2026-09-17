import { useState, useMemo } from 'react';
import { useCourses } from '../../context/useCourses';
import EnrollModal from '../../components/enrollments/EnrollModal';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import { 
  ClipboardCheck, 
  Plus, 
  Search, 
  Trash2, 
  Calendar, 
  User, 
  Award, 
  X,
  Sparkles
} from 'lucide-react';

const EnrollmentManagementPage = () => {
  const {
    enrollments,
    courses,
    removeEnrollment,
    enrollmentSummary
  } = useCourses();

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollmentToRemove, setEnrollmentToRemove] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtered enrollments
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((item) => {
      // 1. Status Filter
      if (statusFilter !== 'All' && item.status !== statusFilter) {
        return false;
      }

      // 2. Course Filter
      if (courseFilter !== 'All' && String(item.courseId) !== String(courseFilter)) {
        return false;
      }

      // 3. Date Filter
      if (dateFilter && item.enrollmentDate !== dateFilter) {
        return false;
      }

      // 4. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesStudent = item.studentName?.toLowerCase().includes(q);
        const matchesEmail = item.studentEmail?.toLowerCase().includes(q);
        const matchesCourse = item.courseTitle?.toLowerCase().includes(q);
        const matchesInstructor = item.instructor?.toLowerCase().includes(q);
        if (!matchesStudent && !matchesEmail && !matchesCourse && !matchesInstructor) {
          return false;
        }
      }

      return true;
    });
  }, [enrollments, statusFilter, courseFilter, dateFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredEnrollments.length / itemsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedEnrollments = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return filteredEnrollments.slice(start, start + itemsPerPage);
  }, [filteredEnrollments, safeCurrentPage, itemsPerPage]);

  const handleConfirmRemove = async () => {
    if (!enrollmentToRemove) return;
    setIsRemoving(true);
    try {
      await removeEnrollment(enrollmentToRemove.id);
      setEnrollmentToRemove(null);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-2">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Course Admissions & Enrollment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Course Enrollments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enroll students into courses, inspect progress, and manage active course rosters.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEnrollModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll Student</span>
        </button>
      </div>

      {/* Enrollment Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Enrollments
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {enrollmentSummary.totalEnrollments}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Across all learning tracks</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Learners
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {enrollmentSummary.uniqueStudents}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Distinct enrolled students</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Completed Courses
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {enrollmentSummary.completedCount}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Certificates awarded</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Top Enrolled Course
            </p>
            <h3 className="text-base font-bold text-slate-900 mt-1 truncate max-w-[180px]" title={enrollmentSummary.topCourse}>
              {enrollmentSummary.topCourse}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{enrollmentSummary.topCourseCount} active registrations</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Ledger Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Filter Controls Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student, course, instructor..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Course Filter Dropdown */}
            <select
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
            >
              <option value="All">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
            >
              <option value="All">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Date Filter */}
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
              />
              {dateFilter && (
                <button
                  type="button"
                  onClick={() => setDateFilter('')}
                  className="text-xs text-slate-400 hover:text-slate-600"
                  title="Clear Date"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <span className="text-xs text-slate-400 font-medium self-end md:self-auto">
            Showing {filteredEnrollments.length} {filteredEnrollments.length === 1 ? 'enrollment' : 'enrollments'}
          </span>
        </div>

        {/* Enrollments Table */}
        {filteredEnrollments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Enrollments Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'All' || courseFilter !== 'All' || dateFilter
                ? 'No enrollment matches your active filters. Try clearing your search or date filter.'
                : 'No course enrollments have been recorded yet.'}
            </p>
            <button
              type="button"
              onClick={() => setIsEnrollModalOpen(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              Enroll Student Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 pl-6">Student</th>
                  <th className="py-3.5 px-4">Enrolled Course</th>
                  <th className="py-3.5 px-4">Instructor</th>
                  <th className="py-3.5 px-4">Enrollment Date</th>
                  <th className="py-3.5 px-4">Status & Progress</th>
                  <th className="py-3.5 pr-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedEnrollments.map((enr) => (
                  <tr key={enr.id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* Student Details */}
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {enr.studentName ? enr.studentName.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{enr.studentName}</div>
                          <div className="text-[11px] text-slate-400">{enr.studentEmail}</div>
                        </div>
                      </div>
                    </td>

                    {/* Enrolled Course */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        {enr.courseThumbnail && (
                          <img
                            src={enr.courseThumbnail}
                            alt={enr.courseTitle}
                            className="w-12 h-9 object-cover rounded-lg shrink-0 border border-slate-200"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate" title={enr.courseTitle}>
                            {enr.courseTitle}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">Course ID: {enr.courseId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Instructor */}
                    <td className="py-4 px-4 text-slate-700 font-medium">
                      {enr.instructor}
                    </td>

                    {/* Enrollment Date */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-700 font-medium text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{enr.enrollmentDate}</span>
                      </div>
                    </td>

                    {/* Status & Progress */}
                    <td className="py-4 px-4 min-w-[140px]">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className={`font-semibold ${enr.status === 'Completed' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                          {enr.status}
                        </span>
                        <span className="text-slate-400 font-mono">{enr.progress || (enr.status === 'Completed' ? 100 : 50)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            enr.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${enr.progress || (enr.status === 'Completed' ? 100 : 50)}%` }}
                        />
                      </div>
                    </td>

                    {/* Remove Enrollment Action */}
                    <td className="py-4 pr-6 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setEnrollmentToRemove(enr)}
                        title="Remove Enrollment"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="px-6 border-t border-slate-100">
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredEnrollments.length}
            itemsPerPage={itemsPerPage}
            itemLabel="enrollments"
          />
        </div>
      </div>

      {/* Enroll Student Modal */}
      {isEnrollModalOpen && (
        <EnrollModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
        />
      )}

      {/* Remove Enrollment Confirmation Modal */}
      <Modal
        isOpen={Boolean(enrollmentToRemove)}
        onClose={() => setEnrollmentToRemove(null)}
        title="Remove Course Enrollment"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Are you sure you want to remove the enrollment for student{' '}
            <span className="font-bold text-slate-900">{enrollmentToRemove?.studentName}</span> in{' '}
            <span className="font-semibold text-slate-800">&quot;{enrollmentToRemove?.courseTitle}&quot;</span>?
            The student will lose access to course materials.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEnrollmentToRemove(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmRemove}
              disabled={isRemoving}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              {isRemoving ? 'Removing...' : 'Yes, Remove Enrollment'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EnrollmentManagementPage;
