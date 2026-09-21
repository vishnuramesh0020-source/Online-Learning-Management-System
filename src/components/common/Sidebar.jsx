import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  PlusCircle,
  X,
  Layers,
  Users,
  ClipboardCheck,
  TrendingUp,
  CheckSquare,
  BarChart3,
  Award,
  User
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';

const Sidebar = ({ isOpen, onClose, onOpenAddCourse }) => {
  const { isStudent, canManageCourses } = useAuth();

  const allNavLinks = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      to: '/courses',
      label: 'Explore Courses',
      icon: Layers
    },
    {
      to: '/my-courses',
      label: 'My Courses',
      icon: BookOpen
    },
    {
      to: '/students',
      label: 'Students',
      icon: Users,
      instructorOnly: true
    },
    {
      to: '/enrollments',
      label: 'Enrollments',
      icon: ClipboardCheck
    },
    {
      to: '/progress',
      label: 'Learning Progress',
      icon: TrendingUp
    },
    {
      to: '/assignments',
      label: 'Assignments & Quizzes',
      icon: CheckSquare
    },
    {
      to: '/reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      instructorOnly: true
    },
    {
      to: '/instructors',
      label: 'Instructors',
      icon: Award
    },
    {
      to: '/profile',
      label: 'My Profile',
      icon: User
    }
  ];

  const navLinks = allNavLinks.filter((link) => {
    if (isStudent && link.instructorOnly) {
      return false;
    }
    return true;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <Link to="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight leading-none block">
                Education Pro
              </span>
              <span className="text-[10px] text-indigo-600 font-semibold tracking-wider uppercase">
                Learning LMS
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Menu
          </p>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}

          {canManageCourses && (
            <div className="pt-6">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Management
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenAddCourse) onOpenAddCourse();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/50 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                <span>Create New Course</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
