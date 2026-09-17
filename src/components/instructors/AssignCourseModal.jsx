import { useState } from 'react';
import Modal from '../common/Modal';
import { useCourses } from '../../context/useCourses';
import { useInstructors } from '../../context/useInstructors';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const AssignCourseModal = ({ isOpen, onClose, instructor = null }) => {
  const { courses, updateCourse } = useCourses();
  const { assignCoursesToInstructor } = useInstructors();

  const [selectedCourseIds, setSelectedCourseIds] = useState(() => {
    if (!instructor) return [];
    const directAssigned = Array.isArray(instructor.assignedCourses) ? instructor.assignedCourses : [];
    const matchByName = courses
      .filter((c) => c.instructor?.toLowerCase() === instructor.name?.toLowerCase())
      .map((c) => c.id);
    return Array.from(new Set([...directAssigned, ...matchByName]));
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleCourse = (courseId) => {
    setSelectedCourseIds((prev) => {
      const exists = prev.some((id) => String(id) === String(courseId));
      if (exists) {
        return prev.filter((id) => String(id) !== String(courseId));
      }
      return [...prev, courseId];
    });
  };

  const handleSaveAssignments = async (e) => {
    e.preventDefault();
    if (!instructor) return;

    setIsSubmitting(true);
    try {
      // 1. Update instructor assignedCourses in InstructorContext
      await assignCoursesToInstructor(instructor.id, selectedCourseIds);

      // 2. Update courses in CourseContext
      for (const c of courses) {
        const isNowAssigned = selectedCourseIds.some((id) => String(id) === String(c.id));
        const wasAssignedToThis = c.instructor?.toLowerCase() === instructor.name?.toLowerCase();

        if (isNowAssigned && !wasAssignedToThis) {
          await updateCourse(c.id, {
            instructor: instructor.name,
            instructorAvatar: instructor.profileImage
          });
        }
      }

      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to update course assignments.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={!isSubmitting ? onClose : undefined}
      title={`Assign Courses to ${instructor?.name || 'Instructor'}`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSaveAssignments} className="space-y-4">
        <p className="text-xs text-slate-500">
          Select the courses this instructor will teach and mentor. Assigned courses will be featured
          on the instructor&apos;s public profile.
        </p>

        {/* Courses Selection Grid */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1 border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
          {courses.map((course) => {
            const isChecked = selectedCourseIds.some((id) => String(id) === String(course.id));

            return (
              <label
                key={course.id}
                onClick={() => handleToggleCourse(course.id)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  isChecked
                    ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-12 h-9 object-cover rounded-lg shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs truncate text-slate-900">{course.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {course.category} • {course.level} • Current: {course.instructor || 'Unassigned'}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-3 transition-colors ${
                    isChecked
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                </div>
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500">
            {selectedCourseIds.length} {selectedCourseIds.length === 1 ? 'course' : 'courses'} selected
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Course Assignments</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AssignCourseModal;
