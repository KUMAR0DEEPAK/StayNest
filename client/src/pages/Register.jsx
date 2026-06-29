import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserPlus } from 'react-icons/fa';

export default function Register() {
  const { register: registerUser } = useContext(AuthContext);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      role: 'STUDENT'
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    const result = await registerUser(
      data.full_name,
      data.email,
      data.password,
      data.phone,
      data.role
    );
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setApiError(result.error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* 3D Register Card (Warm Sand and Chocolate Tones) */}
      <div className="max-w-md w-full bg-white border border-brand-medium/20 border-b-8 border-r-4 border-b-brand-medium/50 border-r-brand-medium/30 rounded-3xl p-8 space-y-6 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="text-center">
          <h2 className="text-3xl font-black text-brand-dark tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-brand-medium font-semibold">Join StayNest and find your perfect place</p>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 border-b-4 border-red-300 p-4 rounded-xl text-sm text-red-700 font-semibold">
            ⚠️ {apiError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-medium/55">
                <FaUser />
              </span>
              <input
                type="text"
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-2 bg-brand-light/10 border ${
                  errors.full_name ? 'border-red-400 focus:ring-red-100' : 'border-brand-medium/20 focus:ring-brand-accent/20 focus:border-brand-accent'
                } rounded-xl focus:outline-none focus:ring-4 shadow-inner transition`}
                {...register('full_name', { required: 'Name is required' })}
              />
            </div>
            {errors.full_name && <p className="text-xs text-red-600 mt-1 font-bold">{errors.full_name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-medium/55">
                <FaEnvelope />
              </span>
              <input
                type="email"
                placeholder="john@example.com"
                className={`w-full pl-10 pr-4 py-2 bg-brand-light/10 border ${
                  errors.email ? 'border-red-400 focus:ring-red-100' : 'border-brand-medium/20 focus:ring-brand-accent/20 focus:border-brand-accent'
                } rounded-xl focus:outline-none focus:ring-4 shadow-inner transition`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                })}
              />
            </div>
            {errors.email && <p className="text-xs text-red-600 mt-1 font-bold">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">Phone Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-medium/55">
                <FaPhone />
              </span>
              <input
                type="tel"
                placeholder="1234567890"
                className="w-full pl-10 pr-4 py-2 bg-brand-light/10 border border-brand-medium/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-accent/20 shadow-inner transition"
                {...register('phone')}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-medium/55">
                <FaLock />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2 bg-brand-light/10 border ${
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

          {/* Role selector (3D select cards) */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-brand-medium/60">Registering as:</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="border border-brand-medium/20 border-b-4 border-r border-b-brand-medium/35 rounded-xl p-3 flex flex-col items-center gap-1 cursor-pointer hover:bg-brand-accent/5 has-[:checked]:border-brand-accent has-[:checked]:bg-brand-accent/15 transition">
                <input
                  type="radio"
                  value="STUDENT"
                  className="accent-brand-medium cursor-pointer"
                  {...register('role')}
                />
                <span className="text-sm font-bold text-brand-dark mt-1">Student</span>
              </label>

              <label className="border border-brand-medium/20 border-b-4 border-r border-b-brand-medium/35 rounded-xl p-3 flex flex-col items-center gap-1 cursor-pointer hover:bg-brand-accent/5 has-[:checked]:border-brand-accent has-[:checked]:bg-brand-accent/15 transition">
                <input
                  type="radio"
                  value="OWNER"
                  className="accent-brand-medium cursor-pointer"
                  {...register('role')}
                />
                <span className="text-sm font-bold text-brand-dark mt-1">Property Owner</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-brand-medium hover:bg-brand-accent text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-wider shadow-md border-b-4 border-r border-brand-dark active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-0.5 transition-all duration-150 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : (
              <>
                <FaUserPlus /> Register
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-brand-medium font-semibold">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-accent hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
