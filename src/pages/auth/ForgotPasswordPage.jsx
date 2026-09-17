import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { forgotPassword, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setSubmitted(true);
      toast.success('Password reset instructions sent to your email!');
    } catch (err) {
      toast.error(err.message || 'Unable to process reset request.');
    }
  };

  return (
    <div className="w-full animate-fade-in">
      {submitted ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-orange-50 text-[#f95a00] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Check your inbox</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            We have dispatched password reset instructions to{' '}
            <span className="font-semibold text-slate-800">{submittedEmail}</span>.
          </p>
          <div className="mt-6 space-y-3">
            <Link
              to="/login"
              className="block w-full py-3 px-4 bg-[#f95a00] hover:bg-[#e05200] text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-orange-500/20"
            >
              Return to Sign In
            </Link>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-xs text-slate-500 hover:text-[#f95a00] font-medium transition-colors"
            >
              Didn&apos;t receive email? Try again
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Forgot Password</h1>
            <p className="text-sm text-slate-500 mt-1">
              Enter your email and we will send you password reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="example.educationpro@gmail.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-[#f95a00] focus:ring-2 focus:ring-orange-100 transition-all outline-none ${
                  errors.email ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.email && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#f95a00] hover:bg-[#e05200] active:scale-[0.99] text-white font-bold rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all text-sm disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Send Reset Instructions</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#f95a00] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
