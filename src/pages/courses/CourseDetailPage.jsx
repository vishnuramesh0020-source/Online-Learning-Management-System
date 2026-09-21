import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useCourses } from '../../context/useCourses';
import CourseFormModal from '../../components/courses/CourseFormModal';
import Modal from '../../components/common/Modal';
import {
  ArrowLeft,
  Star,
  Clock,
  User,
  CheckCircle2,
  Edit2,
  Trash2,
  Share2,
  ShieldCheck,
  BookOpen,
  Award,
  Video
} from 'lucide-react';
import { toast } from 'react-toastify';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canManageCourses } = useAuth();
  const { courses, enrolledCourseIds, toggleEnrollment, deleteCourse } = useCourses();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const course = courses.find((c) => String(c.id) === String(id)) || null;

  if (!course) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto my-12 animate-fade-in">
        <h2 className="text-xl font-bold text-slate-800">Course Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          The requested course could not be located or may have been removed.
        </p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs hover:bg-indigo-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Courses</span>
        </Link>
      </div>
    );
  }

  const isEnrolled = enrolledCourseIds.some((cId) => String(cId) === String(course.id));

  const handleEnrollment = () => {
    toggleEnrollment(course.id);
    if (isEnrolled) {
      toast.info(`Unenrolled from "${course.title}"`);
    } else {
      toast.success(`Congratulations! You are enrolled in "${course.title}"!`);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCourse(course.id);
      toast.success('Course deleted successfully.');
      navigate('/courses');
    } catch (err) {
      toast.error(err.message || 'Failed to delete course');
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Course link copied to clipboard!');
  };

  const defaultModules = [
    'Course Introduction & Environment Setup',
    'Core Conceptual Foundations & Best Practices',
    'Interactive Real-World Project Development',
    'Testing, Security Audits & Edge Cases',
    'Production Deployment & Capstone Review'
  ];

  const modules = course.modules && course.modules.length > 0 ? course.modules : defaultModules;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Breadcrumb / Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Catalog</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            title="Share Course"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {canManageCourses && (
            <>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Grid: Left Details & Right Enrollment Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg">
                {course.category}
              </span>
              <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                {course.level} Level
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              {course.title}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">{course.description}</p>

            {/* Instructor and Stats Row */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                {course.instructorAvatar ? (
                  <img
                    src={course.instructorAvatar}
                    alt={course.instructor}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Instructor</p>
                  <p className="font-semibold text-slate-800 text-xs">{course.instructor}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Rating</p>
                  <p className="font-semibold text-slate-800 text-xs">
                    {Number(course.rating).toFixed(1)} / 5.0
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Duration</p>
                  <p className="font-semibold text-slate-800 text-xs">{course.duration}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Curriculum / Syllabus Accordion */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Course Syllabus & Curriculum</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {modules.length} comprehensive modules • Self-paced access
                </p>
              </div>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                100% Online
              </span>
            </div>

            <div className="space-y-3">
              {modules.map((moduleTitle, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800">{moduleTitle}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Video lecture, code samples, interactive quiz
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-slate-400 shrink-0">45 mins</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Card (4 cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-md">
            {/* Thumbnail */}
            <div className="relative h-52 bg-slate-100 overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md">
                  Preview Course
                </span>
                <span className="text-2xl font-black">
                  {Number(course.price) === 0 ? 'Free' : `₹${Number(course.price).toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Content & Actions */}
            <div className="p-6 space-y-5">
              <button
                type="button"
                onClick={handleEnrollment}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  isEnrolled
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 active:scale-95'
                }`}
              >
                {isEnrolled ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Enrolled • Continue Studying</span>
                  </>
                ) : (
                  <>
                    <span>Enroll in Course</span>
                  </>
                )}
              </button>

              <div className="space-y-3 pt-2 text-xs text-slate-600">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  This Course Includes:
                </p>
                <div className="flex items-center gap-2.5">
                  <Video className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{course.duration} on-demand HD video lectures</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Downloadable assignments and source code</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Official Certificate of Completion</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Lifetime access with 30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Course Modal */}
      {isEditModalOpen && (
        <CourseFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          courseToEdit={course}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Course"
        maxWidth="max-w-md"
      >
        <div className="text-center py-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Are you sure?</h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            This will permanently remove{' '}
            <span className="font-semibold text-slate-800">&quot;{course.title}&quot;</span> from
            the system.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              {deleting ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>Delete Permanently</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CourseDetailPage;
