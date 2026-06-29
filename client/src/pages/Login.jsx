import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    const result = await login(data.email, data.password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setApiError(result.error);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      {/* 3D Login Card (Warm Sand and Chocolate Tones) */}
      <div className="max-w-md w-full bg-white border border-brand-medium/20 border-b-8 border-r-4 border-b-brand-medium/50 border-r-brand-medium/30 rounded-3xl p-8 space-y-6 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="text-center">
          <h2 className="text-3xl font-black text-brand-dark tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-brand-medium font-semibold">Sign in to find or manage your accommodations</p>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 border-b-4 border-red-300 p-4 rounded-xl text-sm text-red-700 font-semibold">
            ⚠️ {apiError}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email input (3D inset effect) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-medium/55">
                <FaEnvelope />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-brand-light/10 border ${
                  errors.email ? 'border-red-400 focus:ring-red-100' : 'border-brand-medium/20 focus:ring-brand-accent/20 focus:border-brand-accent'
                } rounded-xl focus:outline-none focus:ring-4 shadow-inner transition`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
              />
            </div>
            {errors.email && <p className="text-xs text-red-600 mt-1 font-bold">{errors.email.message}</p>}
          </div>

          {/* Password input (3D inset effect) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-medium/55">
                <FaLock />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 bg-brand-light/10 border ${
                  errors.password ? 'border-red-400 focus:ring-red-100' : 'border-brand-medium/20 focus:ring-brand-accent/20 focus:border-brand-accent'
                } rounded-xl focus:outline-none focus:ring-4 shadow-inner transition`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />
            </div>
            {errors.password && <p className="text-xs text-red-600 mt-1 font-bold">{errors.password.message}</p>}
          </div>

          {/* 3D Sign In button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-brand-medium hover:bg-brand-accent text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-wider shadow-md border-b-4 border-r border-brand-dark active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-0.5 transition-all duration-150 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Signing in...' : (
              <>
                <FaSignInAlt /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-brand-medium font-semibold">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-accent hover:underline font-bold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
