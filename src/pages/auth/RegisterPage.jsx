import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import GoogleIcon from '../../components/auth/GoogleIcon';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('Student');
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: true
    }
  });

  const onSubmit = async (data) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: selectedRole
      });
      toast.success('Registration successful! Please login with your new credentials.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleSignUp = async () => {
    toast.info('Google authorization complete. Please log in.');
    navigate('/login');
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Heading */}
      <div className="mb-5">
        <h1 className="text-[28px] font-bold text-[#111827] tracking-tight">Sign Up</h1>
        <p className="text-[13px] text-[#4b5563] mt-1">
          Enter your credentials to create your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-[13px] font-medium text-[#374151] mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            {...register('name', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-[#111827] placeholder:text-[#9ca3af] focus:border-[#fa5507] focus:ring-1 focus:ring-[#fa5507] outline-none transition-all ${
              errors.name ? 'border-rose-400' : 'border-[#e5e7eb]'
            }`}
          />
          {errors.name && (
            <p className="text-rose-500 text-xs mt-1 font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Account Role Selection */}
        <div>
          <label className="block text-[13px] font-medium text-[#374151] mb-1">
            Choose Your Role
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'Student', label: 'Student', desc: 'Learner' },
              { id: 'Instructor', label: 'Instructor', desc: 'Educator' }
            ].map((roleOption) => (
              <label
                key={roleOption.id}
                onClick={() => setSelectedRole(roleOption.id)}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg border cursor-pointer text-center transition-all ${
                  selectedRole === roleOption.id
                    ? 'border-[#fa5507] bg-[#fa5507]/5 text-[#fa5507] font-semibold ring-1 ring-[#fa5507]'
                    : 'border-[#e5e7eb] hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={roleOption.id}
                  checked={selectedRole === roleOption.id}
                  onChange={() => setSelectedRole(roleOption.id)}
                  className="sr-only"
                />
                <span className="text-xs">{roleOption.label}</span>
                <span className="text-[10px] opacity-70">{roleOption.desc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-[13px] font-medium text-[#374151] mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="example.educationpro@gmail.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email'
              }
            })}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-[#111827] placeholder:text-[#9ca3af] focus:border-[#fa5507] focus:ring-1 focus:ring-[#fa5507] outline-none transition-all ${
              errors.email ? 'border-rose-400' : 'border-[#e5e7eb]'
            }`}
          />
          {errors.email && (
            <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-[13px] font-medium text-[#374151] mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="*****************"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
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

        {/* Confirm Password */}
        <div>
          <label className="block text-[13px] font-medium text-[#374151] mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="*****************"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === getValues('password') || 'Passwords do not match'
              })}
              className={`w-full px-3.5 pr-10 py-2.5 bg-white border rounded-lg text-sm text-[#111827] placeholder:text-[#9ca3af] focus:border-[#fa5507] focus:ring-1 focus:ring-[#fa5507] outline-none transition-all ${
                errors.confirmPassword ? 'border-rose-400' : 'border-[#e5e7eb]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b5563] focus:outline-none"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 stroke-[1.5]" />
              ) : (
                <Eye className="w-4 h-4 stroke-[1.5]" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-rose-500 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div>
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('terms', {
                required: 'You must agree to the Terms of Service'
              })}
              className="w-4 h-4 mt-0.5 rounded border-[#d1d5db] text-[#fa5507] focus:ring-[#fa5507]"
            />
            <span className="text-[12px] text-[#4b5563] font-normal leading-tight">
              I agree to the <span className="text-[#fa5507] underline">Terms of Service</span> and{' '}
              <span className="text-[#fa5507] underline">Privacy Policy</span>
            </span>
          </label>
          {errors.terms && (
            <p className="text-rose-500 text-xs mt-1 font-medium">{errors.terms.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-[#fa5507] hover:bg-[#ea4e04] active:scale-[0.99] text-white font-medium rounded-lg text-sm transition-colors shadow-xs disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Sign Up</span>
          )}
        </button>

        {/* Google Sign Up */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-[#e5e7eb] text-[#374151] font-medium rounded-lg text-[13px] flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <GoogleIcon />
          <span>Sign up with google</span>
        </button>
      </form>

      <p className="text-center text-[13px] text-[#374151] mt-5">
        Already have an account?{' '}
        <Link to="/login" className="text-[#fa5507] font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
