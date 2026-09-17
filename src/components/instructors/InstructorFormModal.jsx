import { useState } from 'react';
import Modal from '../common/Modal';
import { User, Mail, Briefcase, Award, Image, Phone, FileText, Loader2 } from 'lucide-react';

const InstructorFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  instructor = null,
  isSubmitting = false
}) => {
  const isEdit = Boolean(instructor);

  const [formData, setFormData] = useState(() => ({
    name: instructor?.name || '',
    email: instructor?.email || '',
    experience: instructor?.experience || '',
    specialization: instructor?.specialization || '',
    profileImage: instructor?.profileImage || '',
    bio: instructor?.bio || '',
    phone: instructor?.phone || ''
  }));

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};

    // Name
    if (!formData.name.trim()) {
      errs.name = 'Instructor Name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email Address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    // Experience
    if (!formData.experience.trim()) {
      errs.experience = 'Experience (e.g. "8 Years") is required.';
    }

    // Specialization
    if (!formData.specialization.trim()) {
      errs.specialization = 'Specialization is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit({
        ...formData,
        profileImage:
          formData.profileImage.trim() ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name.trim())}`
      });
      onClose();
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('email')) {
        setErrors((prev) => ({ ...prev, email: err.message }));
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={!isSubmitting ? onClose : undefined}
      title={isEdit ? 'Edit Instructor Profile' : 'Add New Instructor'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Instructor Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Dr. Sarah Jenkins"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 ${
                errors.name
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-600'
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-rose-600 mt-1 font-medium">{errors.name}</p>
          )}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="e.g. sarah.jenkins@educationpro.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 ${
                  errors.email
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-600'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="e.g. +1 (555) 234-5678"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Experience & Specialization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Teaching Experience *
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. 10 Years"
                value={formData.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 ${
                  errors.experience
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-600'
                }`}
              />
            </div>
            {errors.experience && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.experience}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Core Specialization *
            </label>
            <div className="relative">
              <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Full-Stack Web Development"
                value={formData.specialization}
                onChange={(e) => handleChange('specialization', e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 ${
                  errors.specialization
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-600'
                }`}
              />
            </div>
            {errors.specialization && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.specialization}</p>
            )}
          </div>
        </div>

        {/* Profile Image URL */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Profile Image URL (Optional)
          </label>
          <div className="relative">
            <Image className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.profileImage}
              onChange={(e) => handleChange('profileImage', e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Leave empty to auto-generate an avatar icon.</p>
        </div>

        {/* Professional Bio */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Biography & Background
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <textarea
              rows={3}
              placeholder="Brief summary of professional experience, research, and teaching focus..."
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 resize-none"
            />
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
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEdit ? 'Save Changes' : 'Add Instructor'}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InstructorFormModal;
