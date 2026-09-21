import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useCourses } from '../../context/useCourses';
import {
  Menu,
  Bell,
  Search,
  LogOut,
  BookOpen,
  PlusCircle,
  ChevronDown,
  User
} from 'lucide-react';
import { toast } from 'react-toastify';

const Navbar = ({ onToggleSidebar, onOpenAddCourse }) => {
  const { user, logout, canManageCourses } = useAuth();
  const { searchQuery, setSearchQuery } = useCourses();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out successfully.');
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/courses');
  };

  const roleStyles = {
    Instructor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Student: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Toggle & Brand/Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-md">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses, instructors, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-transparent rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
          />
        </form>
      </div>

      {/* Right: Quick Action, Notifications, User Menu */}
      <div className="flex items-center gap-3">
        {/* Quick Add Course Button (for Instructors) */}
        {canManageCourses && (
          <button
            onClick={() => {
              if (onOpenAddCourse) onOpenAddCourse();
              else navigate('/courses', { state: { openAddModal: true } });
            }}
            className="hidden md:flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-2 rounded-xl border border-indigo-200/60 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>New Course</span>
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 animate-fade-in z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                  2 New
                </span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="font-medium text-slate-800">React 19 Workshop starts in 2 hours!</p>
                  <p className="text-slate-400 mt-1">Today, 2:00 PM with Dr. Sarah Jenkins</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="font-medium text-slate-800">Assignment feedback published</p>
                  <p className="text-slate-400 mt-1">Python for Data Science Quiz 2 graded</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
              alt={user?.name || 'User'}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/20"
            />
            <div className="hidden md:block text-left">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {user?.name || 'Student User'}
                </p>
                <span
                  className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                    roleStyles[user?.role] || roleStyles.Student
                  }`}
                >
                  {user?.role || 'Student'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[130px]">
                {user?.email}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 animate-fade-in z-50">
              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="block px-3 py-2 border-b border-slate-100 mb-1 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{user?.name}</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {user?.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
              </Link>

              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <User className="w-4 h-4 text-indigo-600" />
                <span>My Profile</span>
              </Link>

              <Link
                to="/my-courses"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>My Enrolled Courses</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
