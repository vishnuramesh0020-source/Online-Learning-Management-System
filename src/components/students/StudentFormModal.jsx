import { useState } from 'react';
import Modal from '../common/Modal';
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, Loader2 } from 'lucide-react';

const StudentFormModal = ({ isOpen, onClose, onSubmit, student = null, isSubmitting = false }) => {
  const isEdit = Boolean(student);

  const [formData, setFormData] = useState(() => ({
    fullName: student?.fullName || '',
    email: student?.email || '',
    phone: student?.phone || '',
    address: student?.address || '',
    qualification: student?.qualification || '',
    enrollmentDate: student?.enrollmentDate || new Date().toISOString().split('T')[0]
  }));

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};

    // Full Name
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Name must be at least 2 characters.';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email Address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    // Mobile Number
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      errs.phone = 'Mobile Number is required.';
    } else if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      errs.phone = 'Please enter a valid phone number (at least 7 digits).';
    }

    // Address
    if (!formData.address.trim()) {
      errs.address = 'Residential Address is required.';
    } else if (formData.address.trim().length < 5) {
      errs.address = 'Address must be at least 5 characters.';
    }

    // Qualification
    if (!formData.qualification.trim()) {
      errs.qualification = 'Highest Qualification is required.';
    }

    // Enrollment Date
    if (!formData.enrollmentDate) {
      errs.enrollmentDate = 'Enrollment Date is required.';
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
      await onSubmit(formData);
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
      title={isEdit ? 'Edit Student Details' : 'Register New Student'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Alex Morgan"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 ${
                errors.fullName
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-600'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-rose-600 mt-1 font-medium">{errors.fullName}</p>
          )}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="e.g. alex@example.com"
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
              Mobile Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 ${
                  errors.phone
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-600'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Qualification & Enrollment Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Qualification *
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. B.Tech Computer Science"
                value={formData.qualification}
                onChange={(e) => handleChange('qualification', e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 ${
                  errors.qualification
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-600'
                }`}
              />
            </div>
            {errors.qualification && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.qualification}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Enrollment Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={formData.enrollmentDate}
                onChange={(e) => handleChange('enrollmentDate', e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 ${
                  errors.enrollmentDate
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-600'
                }`}
              />
            </div>
            {errors.enrollmentDate && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.enrollmentDate}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Residential Address *
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <textarea
              rows={3}
              placeholder="e.g. 42 Richmond Road, Bangalore, Karnataka 560025"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 resize-none ${
                errors.address
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-600'
              }`}
            />
          </div>
          {errors.address && (
            <p className="text-xs text-rose-600 mt-1 font-medium">{errors.address}</p>
          )}
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
              <span>{isEdit ? 'Update Student' : 'Add Student'}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentFormModal;
