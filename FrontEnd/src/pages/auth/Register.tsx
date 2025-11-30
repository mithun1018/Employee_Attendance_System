import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register, clearError } from '../../store/slices/authSlice';
import { Mail, Lock, User, Building, AlertCircle, BadgeCheck, Eye, EyeOff, ArrowRight, Clock, CheckCircle, Sparkles, Shield, Users } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee' as 'employee' | 'manager',
    department: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await dispatch(register(registerData));
    
    if (register.fulfilled.match(result)) {
      const user = result.payload.user;
      if (user.role === 'manager') {
        navigate('/manager/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left Side - Branding */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-between"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] border border-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] border border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div className="text-white">
              <span className="text-xl font-bold">AttendanceHub</span>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Start Your Journey<br />With Us Today
            </h1>
            <p className="text-indigo-200 text-lg max-w-md">
              Join thousands of companies that trust AttendanceHub for their workforce management needs.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-white/90">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span>Easy setup in minutes</span>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span>Free to get started</span>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <span>Enterprise-grade security</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-indigo-200 text-sm">
          © 2025 AttendanceHub. All rights reserved.
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md my-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">AttendanceHub</span>
            </div>
          </div>

          <div className="card p-8 sm:p-10 shadow-xl shadow-gray-200/50">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-500">Start your journey with us today</p>
            </div>

            {(error || passwordError) && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{error || passwordError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="form-label">
                  <User className="w-4 h-4 text-gray-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="form-label">
                  <Mail className="w-4 h-4 text-gray-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">
                    <BadgeCheck className="w-4 h-4 text-gray-400" />
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-input cursor-pointer"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">
                    <Building className="w-4 h-4 text-gray-400" />
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="IT"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">
                  <Lock className="w-4 h-4 text-gray-400" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input pr-12"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">
                  <Lock className="w-4 h-4 text-gray-400" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full py-4 text-lg shadow-lg shadow-indigo-500/30"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-500">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="lg:hidden text-center mt-8 text-gray-400 text-sm">
            © 2025 AttendanceHub. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
