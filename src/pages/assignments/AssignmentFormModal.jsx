import { useState } from 'react';
import Modal from '../../components/common/Modal';
import { FileText, Calendar, Award, CheckCircle2, BookOpen } from 'lucide-react';

const AssignmentFormModal = ({ isOpen, onClose, initialData, onSave, courses = [] }) => {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        title: initialData.title || '',
        courseId: initialData.courseId || (courses[0]?.id ?? 1),
        courseTitle: initialData.courseTitle || courses[0]?.title || '',
        instructor: initialData.instructor || courses[0]?.instructor || '',
        dueDate: initialData.dueDate || new Date().toISOString().split('T')[0],
        totalMarks: initialData.totalMarks ?? 100,
        weightage: initialData.weightage ?? 20,
        status: initialData.status || 'Pending',
        description: initialData.description || '',
        requirements: Array.isArray(initialData.requirements)
          ? initialData.requirements.join('\n')
          : initialData.requirements || ''
      };
    }
    const defaultCourse = courses[0];
    return {
      title: '',
      courseId: defaultCourse ? defaultCourse.id : 1,
      courseTitle: defaultCourse ? defaultCourse.title : '',
      instructor: defaultCourse ? defaultCourse.instructor : '',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalMarks: 100,
      weightage: 20,
      status: 'Pending',
      description: '',
      requirements: 'Implement core functionality according to curriculum specs\nEnsure responsive design and edge case handling\nProvide clean repository link and documentation'
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle course dropdown change to auto-fill courseTitle & instructor
  const handleCourseChange = (e) => {
    const cid = e.target.value;
    const matched = courses.find((c) => String(c.id) === String(cid));
    setFormData((prev) => ({
      ...prev,
      courseId: cid,
      courseTitle: matched ? matched.title : prev.courseTitle,
      instructor: matched ? matched.instructor : prev.instructor
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Assignment title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        requirements: formData.requirements
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean)
      });
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to save assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Assignment' : 'Create New Assignment'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Assignment Title <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Next.js 15 Streaming SSR & Server Actions"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Course & Instructor Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Associated Course <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={formData.courseId}
                onChange={handleCourseChange}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Instructor
            </label>
            <input
              type="text"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Due Date, Marks, and Weightage */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Due Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Total Points
            </label>
            <div className="relative">
              <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="number"
                min="10"
                max="500"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Weightage (%)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.weightage}
              onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Submission Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          >
            <option value="Pending">Pending / Not Submitted</option>
            <option value="Submitted">Submitted (Under Review)</option>
            <option value="Graded">Graded</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Problem Statement & Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            placeholder="Describe the objective, architecture guidelines, and expected deliverables..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Deliverables / Requirements (Newline separated) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Deliverable Checklist <span className="text-slate-400 font-normal">(one per line)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Deploy to staging\nImplement unit tests\nSubmit GitHub link"
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Assignment'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignmentFormModal;
