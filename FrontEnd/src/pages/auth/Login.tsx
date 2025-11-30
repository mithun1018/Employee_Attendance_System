import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, clearError } from '../../store/slices/authSlice';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Clock, Sparkles, Shield, Users } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, user, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user && token) {
      navigate(user.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard');
    }
  }, [user, token, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      const user = result.payload.user;
      navigate(user.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard');
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
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
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
              Simplify Your<br />Workforce Management
            </h1>
            <p className="text-indigo-200 text-lg max-w-md">
              Track attendance, manage teams, and generate reports with ease. The smart way to manage your workforce.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-white/90">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span>Real-time attendance tracking</span>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <span>Secure and reliable platform</span>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span>Team management made easy</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-indigo-200 text-sm">
          © 2025 AttendanceHub. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-500">Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 text-sm font-bold">!</span>
                </div>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="form-label">
                  <Mail className="h-4 w-4 text-gray-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div>
                <label className="form-label">
                  <Lock className="h-4 w-4 text-gray-400" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-500">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors hover:underline"
                >
                  Create Account
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

export default Login;
