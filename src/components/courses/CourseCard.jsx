import { Link } from 'react-router-dom';
import {
  Star,
  Clock,
  User,
  Edit2,
  Trash2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useCourses } from '../../context/useCourses';
import { useAuth } from '../../context/useAuth';
import { toast } from 'react-toastify';

const levelBadgeColor = {
  Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  Advanced: 'bg-rose-50 text-rose-700 border-rose-200'
};

const CourseCard = ({ course, onEdit, onDelete }) => {
  const { enrolledCourseIds, toggleEnrollment } = useCourses();
  const { canManageCourses } = useAuth();
  const isEnrolled = enrolledCourseIds.some((id) => String(id) === String(course.id));

  const handleEnrollClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleEnrollment(course.id);
    if (isEnrolled) {
      toast.info(`Unenrolled from "${course.title}"`);
    } else {
      toast.success(`Successfully enrolled in "${course.title}"!`);
    }
  };

  const levelColor =
    levelBadgeColor[course.level] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Thumbnail & Badges */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg">
            {course.category}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute top-3 right-3">
          <span className="text-xs font-extrabold bg-indigo-600 text-white px-2.5 py-1 rounded-lg shadow-sm">
            {Number(course.price) === 0 ? 'Free' : `₹${Number(course.price).toFixed(2)}`}
          </span>
        </div>

        {/* Level & API badge bottom left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span
            className={`text-[10px] font-semibold border px-2 py-0.5 rounded-md backdrop-blur-xs bg-white/90 ${levelColor}`}
          >
            {course.level}
          </span>
          {course.isApi && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs bg-indigo-600/90 text-white shadow-xs">
              API
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Rating and Duration */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <div className="flex items-center gap-1 font-bold text-amber-500">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-slate-800">{Number(course.rating).toFixed(1)}</span>
            <span className="text-slate-400 font-normal">
              ({course.enrolledStudents ? course.enrolledStudents.toLocaleString() : '100+'} students)
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Course Title */}
        <Link
          to={`/courses/${course.id}`}
          className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2"
        >
          {course.title}
        </Link>

        {/* Description */}
        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed flex-1">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {course.instructorAvatar ? (
              <img
                src={course.instructorAvatar}
                alt={course.instructor}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
            <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
              {course.instructor}
            </span>
          </div>

          {/* Action Buttons (Edit, Delete, Details) */}
          <div className="flex items-center gap-1.5">
            {canManageCourses && onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(course);
                }}
                className="p-1.5 rounded-lg border border-slate-200/80 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/70 transition-all cursor-pointer shadow-2xs"
                title="Edit Course"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {canManageCourses && onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(course);
                }}
                className="p-1.5 rounded-lg border border-slate-200/80 text-slate-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/70 transition-all cursor-pointer shadow-2xs"
                title="Delete Course"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <Link
              to={`/courses/${course.id}`}
              className="p-1.5 rounded-lg border border-slate-200/80 text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
              title="View Details"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Enrollment Button */}
        <div className="mt-3">
          <button
            type="button"
            onClick={handleEnrollClick}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] ${
              isEnrolled
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-2xs'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-md'
            }`}
          >
            {isEnrolled ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Enrolled</span>
              </>
            ) : (
              <span>Enroll Now</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
