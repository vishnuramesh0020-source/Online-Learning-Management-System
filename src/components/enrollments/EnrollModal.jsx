import { useState } from 'react';
import Modal from '../common/Modal';
import { useStudents } from '../../context/useStudents';
import { useCourses } from '../../context/useCourses';
import { User, BookOpen, Calendar, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const EnrollModal = ({ isOpen, onClose, preselectedCourseId = null, preselectedStudentId = null }) => {
  const { students } = useStudents();
  const { courses, enrollStudent, isStudentEnrolled } = useCourses();

  const [selectedStudentId, setSelectedStudentId] = useState(
    () => preselectedStudentId || (students.length > 0 ? students[0].id : '')
  );
  const [selectedCourseId, setSelectedCourseId] = useState(
    () => preselectedCourseId || (courses.length > 0 ? courses[0].id : '')
  );
  const [enrollmentDate, setEnrollmentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('In Progress');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected student and course
  const selectedStudent = students.find((s) => String(s.id) === String(selectedStudentId));
  const selectedCourse = courses.find((c) => String(c.id) === String(selectedCourseId));

  // Check duplicate enrollment
  const isDuplicate = Boolean(
    selectedStudentId && selectedCourseId && isStudentEnrolled(selectedStudentId, selectedCourseId)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!selectedStudentId) {
      errs.student = 'Please select a student.';
    }
    if (!selectedCourseId) {
      errs.course = 'Please select a course.';
    } else if (isDuplicate) {
      errs.course = 'This student is already enrolled in this course.';
    }
    if (!enrollmentDate) {
      errs.enrollmentDate = 'Enrollment date is required.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      await enrollStudent({
        studentId: selectedStudent.id,
        studentName: selectedStudent.fullName,
        studentEmail: selectedStudent.email,
        courseId: selectedCourse.id,
        enrollmentDate,
        status,
        progress: 0
      });
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Enrollment failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={!isSubmitting ? onClose : undefined}
      title="Enroll Student in Course"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Error Callout */}
        {errors.form && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Step 1: Select Student */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            1. Select Student *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                setErrors((prev) => ({ ...prev, student: undefined, form: undefined }));
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
            >
              <option value="">-- Choose Registered Student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.email}) — {s.qualification}
                </option>
              ))}
            </select>
          </div>
          {errors.student && (
            <p className="text-xs text-rose-600 mt-1 font-medium">{errors.student}</p>
          )}

          {/* Student preview snippet */}
          {selectedStudent && (
            <div className="mt-2 p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100/60 flex items-center gap-3">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.fullName}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900">{selectedStudent.fullName}</span>
                <span className="text-slate-500 text-[11px] block">{selectedStudent.email} • {selectedStudent.phone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Select Course */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            2. Select Course *
          </label>
          <div className="relative">
            <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setErrors((prev) => ({ ...prev, course: undefined, form: undefined }));
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
            >
              <option value="">-- Choose Course --</option>
              {courses.map((c) => {
                const enrolled = selectedStudentId && isStudentEnrolled(selectedStudentId, c.id);
                return (
                  <option key={c.id} value={c.id} disabled={enrolled}>
                    {c.title} ({c.category}) {enrolled ? '— [Already Enrolled]' : `— $${c.price}`}
                  </option>
                );
              })}
            </select>
          </div>
          {errors.course && (
            <p className="text-xs text-rose-600 mt-1 font-medium">{errors.course}</p>
          )}

          {/* Duplicate Enrollment Warning */}
          {isDuplicate && (
            <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Duplicate Enrollment:</strong> {selectedStudent?.fullName} is already enrolled in this course. Please pick a different course.
              </span>
            </div>
          )}

          {/* Course preview snippet */}
          {selectedCourse && (
            <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
              <img
                src={selectedCourse.thumbnail}
                alt={selectedCourse.title}
                className="w-12 h-10 object-cover rounded-lg shrink-0"
              />
              <div className="text-xs flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 truncate">{selectedCourse.title}</h4>
                <p className="text-[11px] text-slate-500">Instructor: {selectedCourse.instructor} • {selectedCourse.duration}</p>
              </div>
              <span className="text-xs font-bold text-indigo-600">${selectedCourse.price}</span>
            </div>
          )}
        </div>

        {/* Step 3: Enrollment Date & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Enrollment Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={enrollmentDate}
                onChange={(e) => setEnrollmentDate(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
            >
              <option value="In Progress">In Progress (Active)</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isDuplicate || !selectedCourseId || !selectedStudentId}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enrolling...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Confirm Enrollment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EnrollModal;
