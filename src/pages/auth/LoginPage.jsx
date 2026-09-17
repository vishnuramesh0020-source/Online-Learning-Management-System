import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import GoogleIcon from '../../components/auth/GoogleIcon';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    // If user leaves blank and submits, auto-fill with the mockup account
    const emailToUse = data.email.trim() || 'example.educationpro@gmail.com';
    const passToUse = data.password || 'password123';

    try {
      await login(emailToUse, passToUse);
      toast.success('Welcome back to Education Pro!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed. Please verify credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await login('example.educationpro@gmail.com', 'password123');
      toast.success('Signed in successfully with Google!');
      navigate(from, { replace: true });
    } catch {
      toast.error('Google sign in failed');
    }
  };

  const handleDemoLogin = async (email) => {
    try {
      await login(email, 'password123');
      toast.success(`Signed in with demo credentials!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Demo login failed');
    }
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#111827] tracking-tight">Login</h1>
        <p className="text-[13px] text-[#4b5563] mt-1">
          Enter your credentials to login to your account
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
            Email
          </label>
          <input
            type="email"
            placeholder="example.educationpro@gmail.com"
            {...register('email')}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-[#111827] placeholder:text-[#9ca3af] focus:border-[#fa5507] focus:ring-1 focus:ring-[#fa5507] outline-none transition-all ${
              errors.email ? 'border-rose-400' : 'border-[#e5e7eb]'
            }`}
          />
          {errors.email && (
            <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="*****************"
              {...register('password')}
              className={`w-full px-3.5 pr-10 py-2.5 bg-white border rounded-lg text-sm text-[#111827] placeholder:text-[#9ca3af] focus:border-[#fa5507] focus:ring-1 focus:ring-[#fa5507] outline-none transition-all ${
                errors.password ? 'border-rose-400' : 'border-[#e5e7eb]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b5563] focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 stroke-[1.5]" />
              ) : (
                <Eye className="w-4 h-4 stroke-[1.5]" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-rose-500 text-xs mt-1 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="w-4 h-4 rounded border-[#d1d5db] text-[#fa5507] focus:ring-[#fa5507]"
            />
            <span className="text-[13px] text-[#374151]">Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-[13px] text-[#fa5507] hover:underline font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-[#fa5507] hover:bg-[#ea4e04] active:scale-[0.99] text-white font-medium rounded-lg text-sm transition-colors shadow-xs disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Sign In</span>
          )}
        </button>

        {/* Sign In With Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-[#e5e7eb] text-[#374151] font-medium rounded-lg text-[13px] flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <GoogleIcon />
          <span>Sign in with google</span>
        </button>
      </form>

      {/* Quick Demo Accounts by Role */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center mb-2">
          Demo Logins by Role
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleDemoLogin('student@lms.com')}
            className="px-3 py-2 rounded-lg border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold text-center transition-colors cursor-pointer"
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('instructor@lms.com')}
            className="px-3 py-2 rounded-lg border border-orange-200 bg-orange-50/60 hover:bg-orange-100 text-[#fa5507] text-xs font-semibold text-center transition-colors cursor-pointer"
          >
            Instructor
          </button>
        </div>
      </div>

      {/* Redirect to Sign Up */}
      <p className="text-center text-[13px] text-[#374151] mt-5">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-[#fa5507] font-semibold hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
