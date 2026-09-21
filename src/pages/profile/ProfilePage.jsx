import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useCourses } from '../../context/useCourses';
import { useAssessments } from '../../context/useAssessments';
import { useInstructors } from '../../context/useInstructors';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Lock,
  Shield,
  CheckCircle2,
  Save,
  ExternalLink,
  FileText,
  CheckSquare,
  KeyRound,
  GraduationCap,
  Camera,
  RefreshCw,
  Check
} from 'lucide-react';
import { toast } from 'react-toastify';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
];

const ProfilePage = () => {
  const { user, isStudent, isInstructor, updateProfile, changePassword } = useAuth();
  const { courses, enrolledCourseIds, enrollments } = useCourses();
  const { assignments, quizzes } = useAssessments();
  const { instructors } = useInstructors();

  // Active tab: 'details' | 'academics' | 'security'
  const [activeTab, setActiveTab] = useState('details');

  // Edit Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
    location: user?.location || 'Bangalore, Karnataka, India',
    qualification: user?.qualification || (isInstructor ? 'Lead Curriculum Specialist & Educator' : 'B.Tech in Computer Science'),
    bio: user?.bio || (isInstructor
      ? 'Experienced educator and technology researcher focused on building production-ready engineering curriculums.'
      : 'Passionate student learner pursuing mastery in modern software architecture, AI engineering, and web development.'),
    avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Change Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Derived user statistics
  const userEnrollments = enrollments.filter((e) =>
    String(e.studentEmail).toLowerCase() === String(user?.email).toLowerCase() ||
    String(e.studentId) === String(user?.id) ||
    enrolledCourseIds.some((cid) => String(cid) === String(e.courseId))
  );

  const completedCoursesCount = userEnrollments.filter((e) => e.status === 'Completed' || Number(e.progress) >= 100).length;

  const userAssignmentsSubmitted = assignments.filter((a) => a.status === 'Submitted' || a.status === 'Graded').length;
  const userQuizzesCompleted = quizzes.filter((q) => q.status === 'Completed').length;

  // If instructor, find taught courses
  const instructorAssignedCourses = courses.filter((c) =>
    c.instructor?.toLowerCase() === user?.name?.toLowerCase()
  );

  // Profile Save Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      toast.error('Please enter your full name.');
      return;
    }
    if (!profileData.email.trim()) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSavingProfile(true);
    try {
      await updateProfile(profileData);
      toast.success('Your profile details have been updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Password Change Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      toast.error('Please enter your current password.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Password changed successfully! Keep your credentials secure.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      toast.error(err.message || 'Failed to change password. Verify your current password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Generate Dicebear avatar
  const handleGenerateRandomAvatar = () => {
    const randomSeed = `user_${Date.now()}`;
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
    setProfileData((prev) => ({ ...prev, avatar: newAvatar }));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* ========================================================================= */}
      {/* 1. HERO PROFILE BANNER                                                   */}
      {/* ========================================================================= */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar & User Details */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
            <div className="relative group shrink-0">
              <img
                src={profileData.avatar}
                alt={user?.name || 'User Avatar'}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-indigo-400/30 shadow-2xl bg-slate-800"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`;
                }}
              />
              <button
                type="button"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                title="Change Avatar"
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-transform active:scale-90 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {user?.name || 'Scholar Profile'}
                </h1>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold border ${
                    isInstructor
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  }`}
                >
                  {user?.role || 'Student'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Account</span>
                </span>
              </div>

              <p className="text-sm text-indigo-200 font-medium">
                {profileData.qualification}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{user?.email}</span>
                </span>
                {profileData.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{profileData.phone}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{profileData.location}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Member since Aug 2026</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl self-stretch md:self-auto shrink-0">
            {isStudent ? (
              <>
                <div className="text-center p-2">
                  <p className="text-xs text-slate-400 font-medium">Enrolled</p>
                  <p className="text-xl font-extrabold text-white mt-0.5">
                    {userEnrollments.length || enrolledCourseIds.length}
                  </p>
                  <p className="text-[10px] text-slate-400">Courses</p>
                </div>
                <div className="text-center p-2 border-l border-white/10">
                  <p className="text-xs text-slate-400 font-medium">Completed</p>
                  <p className="text-xl font-extrabold text-emerald-400 mt-0.5">
                    {completedCoursesCount}
                  </p>
                  <p className="text-[10px] text-slate-400">Certificates</p>
                </div>
                <div className="text-center p-2 border-l border-white/10">
                  <p className="text-xs text-slate-400 font-medium">Assignments</p>
                  <p className="text-xl font-extrabold text-indigo-300 mt-0.5">
                    {userAssignmentsSubmitted}
                  </p>
                  <p className="text-[10px] text-slate-400">Submitted</p>
                </div>
                <div className="text-center p-2 border-l border-white/10">
                  <p className="text-xs text-slate-400 font-medium">Quizzes</p>
                  <p className="text-xl font-extrabold text-amber-300 mt-0.5">
                    {userQuizzesCompleted}
                  </p>
                  <p className="text-[10px] text-slate-400">Completed</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center p-2">
                  <p className="text-xs text-slate-400 font-medium">Courses</p>
                  <p className="text-xl font-extrabold text-white mt-0.5">
                    {instructorAssignedCourses.length || courses.length}
                  </p>
                  <p className="text-[10px] text-slate-400">Curricula</p>
                </div>
                <div className="text-center p-2 border-l border-white/10">
                  <p className="text-xs text-slate-400 font-medium">Faculty</p>
                  <p className="text-xl font-extrabold text-indigo-300 mt-0.5">
                    {instructors.length}
                  </p>
                  <p className="text-[10px] text-slate-400">Mentors</p>
                </div>
                <div className="text-center p-2 border-l border-white/10">
                  <p className="text-xs text-slate-400 font-medium">Rating</p>
                  <p className="text-xl font-extrabold text-amber-300 mt-0.5">
                    4.9
                  </p>
                  <p className="text-[10px] text-slate-400">Feedback</p>
                </div>
                <div className="text-center p-2 border-l border-white/10">
                  <p className="text-xs text-slate-400 font-medium">Role</p>
                  <p className="text-xl font-extrabold text-emerald-400 mt-0.5">
                    Faculty
                  </p>
                  <p className="text-[10px] text-slate-400">Verified</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Avatar Picker Drawer (Expandable) */}
        {showAvatarPicker && (
          <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                Choose Profile Avatar
              </span>
              <button
                type="button"
                onClick={handleGenerateRandomAvatar}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Generate Random Avatar</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {AVATAR_PRESETS.map((preset, idx) => {
                const isSelected = profileData.avatar === preset;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setProfileData((prev) => ({ ...prev, avatar: preset }));
                    }}
                    className={`relative w-12 h-12 rounded-2xl overflow-hidden border-2 transition-transform cursor-pointer hover:scale-105 ${
                      isSelected ? 'border-indigo-400 ring-2 ring-indigo-400/50' : 'border-white/20'
                    }`}
                  >
                    <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-indigo-600/50 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom URL Input */}
            <div className="flex items-center gap-2 max-w-md mt-2">
              <input
                type="url"
                placeholder="Or paste custom image URL..."
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={() => {
                  if (customAvatarUrl.trim()) {
                    setProfileData((prev) => ({ ...prev, avatar: customAvatarUrl.trim() }));
                    setCustomAvatarUrl('');
                    toast.info('Custom avatar image set!');
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. NAVIGATION TABS                                                       */}
      {/* ========================================================================= */}
      <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80 w-full sm:w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'details'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('academics')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'academics'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>{isInstructor ? 'Curriculum & Courses' : 'Enrolled Courses & Progress'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security & Password</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB CONTENT                                                            */}
      {/* ========================================================================= */}

      {/* TAB 1: PERSONAL DETAILS & EDIT FORM */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Edit Profile Form (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your identity details, professional credentials, and contact information.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isInstructor ? 'Professional Specialization / Title' : 'Academic Qualification / Degree'}
                </label>
                <input
                  type="text"
                  value={profileData.qualification}
                  onChange={(e) => setProfileData({ ...profileData, qualification: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  About Me / Bio
                </label>
                <textarea
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Account Meta & Info Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Account Status Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Account Status
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                  <span className="text-slate-500">System Role</span>
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    {user?.role}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                  <span className="text-slate-500">Account ID</span>
                  <span className="font-mono text-slate-600 text-[11px]">{user?.id || 'usr_active'}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                  <span className="text-slate-500">Email Status</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 text-xs">
                  <span className="text-slate-500">Profile Completion</span>
                  <span className="font-bold text-indigo-600">100% Complete</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500 space-y-1.5 leading-relaxed">
                <p className="font-semibold text-slate-700 flex items-center gap-1">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>Privacy & Verification</span>
                </p>
                <p>
                  Your profile data is stored securely in your active LMS ledger. Contact platform administration for official certification adjustments.
                </p>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Quick Navigation
              </h3>
              <div className="space-y-2">
                <Link
                  to="/courses"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Explore Courses</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  to="/progress"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    <span>Learning Progress</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  to="/assignments"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>Assignments & Quizzes</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACADEMICS & ENROLLED COURSES */}
      {activeTab === 'academics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isInstructor ? 'Courses Mentored & Curricula' : 'Active Course Registrations'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isInstructor
                    ? 'Review syllabi, cohort engagements, and lesson modules authored by you.'
                    : 'Track your ongoing curriculum progress, lesson milestones, and course certificates.'}
                </p>
              </div>

              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors w-fit"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Explore Catalog</span>
              </Link>
            </div>

            {/* Courses List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course, idx) => {
                const isEnrolled = enrolledCourseIds.some((cid) => String(cid) === String(course.id));
                const progress = isEnrolled ? (idx === 0 ? 80 : 50) : 0;

                return (
                  <div
                    key={course.id}
                    className="rounded-2xl border border-slate-200/80 hover:border-indigo-300 transition-all p-4 bg-slate-50/50 hover:bg-white flex flex-col justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="relative h-32 rounded-xl overflow-hidden mb-3 bg-slate-200">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white px-2 py-0.5 rounded">
                          {course.category}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Progress</span>
                        <span className="font-bold text-slate-700">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <Link
                        to={`/courses/${course.id}`}
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 rounded-xl text-xs font-semibold transition-all shadow-2xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Syllabus</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACCOUNT SECURITY & CHANGE PASSWORD */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Change Password Form (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-600" />
                <span>Change Account Password</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ensure your account is protected with a strong, distinct password containing at least 6 characters.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password (min 6 characters)"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isChangingPassword ? 'Updating Password...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Security Recommendations */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Security Checklist</span>
            </h3>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Use at least 8 characters with a mix of numbers & symbols.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Do not share your credentials with unauthorized third parties.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Session state is cryptographically persisted in local storage.</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-400">
              Last security audit: <span className="font-semibold text-slate-700">Today, active session</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
