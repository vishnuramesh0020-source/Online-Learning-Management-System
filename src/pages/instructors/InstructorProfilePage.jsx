import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInstructors } from '../../context/useInstructors';
import { useCourses } from '../../context/useCourses';
import InstructorFormModal from '../../components/instructors/InstructorFormModal';
import AssignCourseModal from '../../components/instructors/AssignCourseModal';
import CourseCard from '../../components/courses/CourseCard';
import { 
  ArrowLeft, 
  Mail, 
  Briefcase, 
  Star, 
  Phone, 
  BookOpen, 
  Edit2, 
  CheckCircle
} from 'lucide-react';

const InstructorProfilePage = () => {
  const { id } = useParams();
  const { getInstructorById, updateInstructor } = useInstructors();
  const { courses } = useCourses();

  const instructor = getInstructorById(id);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!instructor) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto my-12 animate-fade-in">
        <h2 className="text-xl font-bold text-slate-800">Instructor Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          The requested instructor profile does not exist or may have been removed.
        </p>
        <Link
          to="/instructors"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs hover:bg-indigo-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Instructors</span>
        </Link>
      </div>
    );
  }

  // Find all courses assigned to this instructor
  const assignedCourses = courses.filter((c) => {
    const isDirect = Array.isArray(instructor.assignedCourses) && instructor.assignedCourses.some((cid) => String(cid) === String(c.id));
    const isNameMatch = c.instructor?.toLowerCase() === instructor.name?.toLowerCase();
    return isDirect || isNameMatch;
  });

  const handleEditSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await updateInstructor(instructor.id, formData);
      setIsEditModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/instructors"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Instructors</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAssignModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Assign Courses</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Hero Profile Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <img
              src={instructor.profileImage}
              alt={instructor.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-indigo-100 shadow-md bg-slate-100 shrink-0"
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(instructor.name)}`;
              }}
            />
            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 fill-current" />
              <span>{instructor.rating || '4.9'}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {instructor.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified Mentor</span>
              </span>
            </div>

            <p className="text-sm font-semibold text-indigo-600">
              {instructor.specialization}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {instructor.bio || 'Dedicated educator and industry professional with a passion for teaching modern engineering.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{instructor.email}</span>
              </span>
              {instructor.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{instructor.phone}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-500" />
                <span>{instructor.experience} Experience</span>
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>{assignedCourses.length} Assigned {assignedCourses.length === 1 ? 'Course' : 'Courses'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Courses Taught by {instructor.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore current curricula, syllabi, and active cohorts mentored by this educator.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAssignModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manage Assigned Courses</span>
          </button>
        </div>

        {assignedCourses.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 shadow-xs">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No Courses Assigned Yet</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              This instructor currently does not have any courses assigned in the curriculum.
            </p>
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              Assign First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Instructor Modal */}
      {isEditModalOpen && (
        <InstructorFormModal
          key={instructor?.id || 'inst'}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          instructor={instructor}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Assign Course Modal */}
      {isAssignModalOpen && (
        <AssignCourseModal
          key={instructor?.id || 'assign'}
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          instructor={instructor}
        />
      )}
    </div>
  );
};

export default InstructorProfilePage;
