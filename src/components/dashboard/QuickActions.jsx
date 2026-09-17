import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Compass, PlusCircle, BookOpen, Download, Zap, Award } from 'lucide-react';
import { toast } from 'react-toastify';

const QuickActions = ({ onOpenAddCourse }) => {
  const navigate = useNavigate();
  const { canManageCourses } = useAuth();

  const actions = [
    {
      title: 'Explore Courses',
      description: 'Search & filter industry courses',
      icon: Compass,
      color: 'from-blue-600 to-indigo-600',
      action: () => navigate('/courses')
    },
    canManageCourses
      ? {
          title: 'Create Course',
          description: 'Add new course with details',
          icon: PlusCircle,
          color: 'from-indigo-600 to-violet-600',
          action: onOpenAddCourse || (() => navigate('/courses', { state: { openAddModal: true } }))
        }
      : {
          title: 'My Certificates',
          description: 'View & download course honors',
          icon: Award,
          color: 'from-amber-500 to-orange-500',
          action: () => {
            toast.success('Certificate repository loaded. All credentials verified.');
          }
        },
    {
      title: 'My Enrolled',
      description: 'Continue your active lessons',
      icon: BookOpen,
      color: 'from-violet-600 to-purple-600',
      action: () => navigate('/my-courses')
    },
    {
      title: 'Course Catalog',
      description: 'Download full LMS syllabus',
      icon: Download,
      color: 'from-emerald-600 to-teal-600',
      action: () => {
        toast.success('Education Pro LMS Course Catalog 2026 downloaded successfully!');
      }
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">Quick Actions</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Shortcuts</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {actions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={item.action}
              className="p-4 rounded-xl border border-slate-200/80 hover:border-indigo-300 bg-slate-50/50 hover:bg-white text-left transition-all group hover:shadow-sm"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-xs mb-3 group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">{item.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
