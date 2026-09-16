import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GraduationCap, Sparkles, Award, Users, BookOpen } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient blurs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

      <ToastContainer
        position="top-right"
        autoClose={3500}
        theme="colored"
      />

      <div className="max-w-4xl w-full mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100/20">
          {/* Brand Info Banner */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-10 flex-col justify-between text-white relative">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">EduSphere</h1>
                  <p className="text-xs text-indigo-200">Online Learning Management</p>
                </div>
              </div>

              <div className="mt-12 space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/10 border border-white/15">
                    <BookOpen className="w-4 h-4 text-indigo-200" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Industry-Aligned Courses</h4>
                    <p className="text-xs text-indigo-200 mt-0.5">Learn React 19, Python, Cloud & AI.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/10 border border-white/15">
                    <Users className="w-4 h-4 text-indigo-200" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Top Global Instructors</h4>
                    <p className="text-xs text-indigo-200 mt-0.5">Learn directly from verified educators.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/10 border border-white/15">
                    <Award className="w-4 h-4 text-indigo-200" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Recognized Certificates</h4>
                    <p className="text-xs text-indigo-200 mt-0.5">Boost your portfolio with verified credentials.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/15">
              <div className="flex items-center gap-2 text-xs text-indigo-100">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Join 25,000+ ambitious developers today</span>
              </div>
            </div>
          </div>

          {/* Dynamic Form Area */}
          <div className="col-span-1 lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
