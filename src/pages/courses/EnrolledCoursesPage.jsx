import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '../../context/useCourses';
import Modal from '../../components/common/Modal';
import { BookOpen, PlayCircle, Award, Clock, Layers, Calendar, Trash2, ClipboardCheck } from 'lucide-react';

const EnrolledCoursesPage = () => {
  const { courses, enrolledCourseIds, enrollments, toggleEnrollment, removeEnrollment } = useCourses();
  const [courseToUnenroll, setCourseToUnenroll] = useState(null);

  const enrolledCourses = courses.filter((c) =>
    enrolledCourseIds.some((id) => String(id) === String(c.id))
  );

  const handleConfirmUnenroll = () => {
    if (!courseToUnenroll) return;
    toggleEnrollment(courseToUnenroll.id);
    // Also remove from enrollments if matching
    const matchingEnr = enrollments.find((e) => String(e.courseId) === String(courseToUnenroll.id));
    if (matchingEnr) {
      removeEnrollment(matchingEnr.id);
    }
    setCourseToUnenroll(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Enrolled Courses
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your ongoing progress, continue lessons, and complete certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/enrollments"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-colors"
          >
            <ClipboardCheck className="w-4 h-4 text-emerald-600" />
            <span>All Enrollments Ledger</span>
          </Link>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-200 transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto my-12">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Enrolled Courses Yet</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            You haven&apos;t enrolled in any courses yet. Browse our catalog and start learning
            today!
          </p>
          <Link
            to="/courses"
            className="inline-block mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course, idx) => {
            const progress = idx === 0 ? 80 : (idx + 1) * 25;
            const isCompleted = progress >= 100;

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white px-2.5 py-1 rounded-md">
                      {course.category}
                    </span>
                  </div>
                  {isCompleted && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-xs">
                      <Award className="w-3 h-3" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span>{course.level}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <Calendar className="w-3 h-3 text-indigo-500" />
                      <span>Enrolled: 2026-08-15</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed flex-1">
                    {course.description}
                  </p>

                  {/* Progress Indicator */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                      <span>Completion</span>
                      <span className="font-bold text-slate-700">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Link
                      to={`/courses/${course.id}`}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Continue</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setCourseToUnenroll(course)}
                      title="Remove Enrollment"
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Unenroll Confirmation Modal */}
      <Modal
        isOpen={Boolean(courseToUnenroll)}
        onClose={() => setCourseToUnenroll(null)}
        title="Unenroll from Course"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Are you sure you want to remove your enrollment from{' '}
            <span className="font-bold text-slate-900">&quot;{courseToUnenroll?.title}&quot;</span>?
            Your saved lesson progress will be removed.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCourseToUnenroll(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmUnenroll}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Yes, Unenroll
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EnrolledCoursesPage;
