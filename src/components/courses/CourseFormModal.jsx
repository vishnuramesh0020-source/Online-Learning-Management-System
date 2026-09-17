import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../common/Modal';
import { useCourses } from '../../context/useCourses';
import { CATEGORIES } from '../../utils/dummyData';
import { toast } from 'react-toastify';
import { Sparkles, Image, BookOpen, User, Tag, Clock, Layers, DollarSign, Star } from 'lucide-react';

const PRESET_THUMBNAILS = [
  { label: 'React / Web', url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80' },
  { label: 'Data Science', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80' },
  { label: 'Design', url: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cloud / K8s', url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80' }
];

const CourseFormModal = ({ isOpen, onClose, courseToEdit = null, onSuccess }) => {
  const { addCourse, updateCourse } = useCourses();
  const [submitting, setSubmitting] = useState(false);
  const isEditMode = Boolean(courseToEdit);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      instructor: '',
      category: 'Web Development',
      duration: '24 Hours',
      level: 'Beginner',
      price: 49.99,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      description: ''
    }
  });

  // Populate or reset form on open / change
  useEffect(() => {
    if (courseToEdit) {
      reset({
        title: courseToEdit.title || '',
        instructor: courseToEdit.instructor || '',
        category: courseToEdit.category || 'Web Development',
        duration: courseToEdit.duration || '24 Hours',
        level: courseToEdit.level || 'Beginner',
        price: courseToEdit.price || 0,
        rating: courseToEdit.rating || 4.5,
        thumbnail: courseToEdit.thumbnail || '',
        description: courseToEdit.description || ''
      });
    } else {
      reset({
        title: '',
        instructor: '',
        category: 'Web Development',
        duration: '24 Hours',
        level: 'Beginner',
        price: 49.99,
        rating: 4.8,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
        description: ''
      });
    }
  }, [courseToEdit, isOpen, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (isEditMode) {
        await updateCourse(courseToEdit.id, data);
        toast.success(`Course "${data.title}" updated successfully!`);
      } else {
        await addCourse(data);
        toast.success(`Course "${data.title}" created successfully!`);
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const cleanCategories = CATEGORIES.filter((c) => c !== 'All');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Course Details' : 'Create New Course'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Course Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Course Name *
          </label>
          <div className="relative">
            <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Advanced TypeScript & Clean Architecture"
              {...register('title', {
                required: 'Course name is required',
                minLength: { value: 5, message: 'Course name must be at least 5 characters' }
              })}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
          {errors.title && (
            <p className="text-rose-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Instructor Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Instructor Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Dr. Jane Foster"
                {...register('instructor', {
                  required: 'Instructor name is required'
                })}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>
            {errors.instructor && (
              <p className="text-rose-500 text-xs mt-1">{errors.instructor.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Category *
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all cursor-pointer"
              >
                {cleanCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Duration, Level, Price, Rating Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Duration *
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="28 Hours"
                {...register('duration', { required: 'Required' })}
                className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Level *
            </label>
            <div className="relative">
              <Layers className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                {...register('level')}
                className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Price ($) *
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="49.99"
                {...register('price', {
                  required: 'Required',
                  min: { value: 0, message: '>= 0' }
                })}
                className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Rating (1-5) *
            </label>
            <div className="relative">
              <Star className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                placeholder="4.8"
                {...register('rating', {
                  required: 'Required',
                  min: { value: 1, message: '>= 1' },
                  max: { value: 5, message: '<= 5' }
                })}
                className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Course Thumbnail */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Thumbnail Image URL *
            </label>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>Presets:</span>
              {PRESET_THUMBNAILS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setValue('thumbnail', preset.url)}
                  className="text-indigo-600 hover:text-indigo-800 underline font-semibold"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Image className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              {...register('thumbnail', { required: 'Thumbnail URL is required' })}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
          {errors.thumbnail && (
            <p className="text-rose-500 text-xs mt-1">{errors.thumbnail.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Course Description *
          </label>
          <textarea
            rows={3}
            placeholder="Describe what students will master in this course..."
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 15, message: 'Description must be at least 15 characters' }
            })}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
          />
          {errors.description && (
            <p className="text-rose-500 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isEditMode ? (
              <span>Save Changes</span>
            ) : (
              <span>Create Course</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CourseFormModal;
