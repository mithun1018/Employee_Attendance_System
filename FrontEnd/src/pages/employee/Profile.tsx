import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { User, Mail, Building, BadgeCheck, Calendar, Shield, Sparkles, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Profile: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  const profileDetails = [
    {
      icon: Mail,
      label: 'Email Address',
      value: user.email,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: BadgeCheck,
      label: 'Employee ID',
      value: user.employeeId || 'N/A',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: Building,
      label: 'Department',
      value: user.department || 'N/A',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Shield,
      label: 'Role',
      value: user.role,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      capitalize: true,
    },
  ];

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-8 lg:space-y-10 animate-fadeIn pb-8">
        {/* Profile Hero Card */}
      <div className="relative overflow-hidden rounded-3xl" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
                <span className="text-5xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg border-4 border-white">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            
            {/* User Info */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-indigo-200 text-sm font-medium">Verified Employee</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{user.name}</h1>
              <p className="text-indigo-200 text-lg capitalize">{user.role} • {user.department || 'No Department'}</p>
              
              {user.createdAt && (
                <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Calendar className="w-4 h-4 text-indigo-200" />
                  <span className="text-sm text-indigo-100">
                    Member since {format(parseISO(user.createdAt), 'MMMM yyyy')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profileDetails.map((detail, index) => (
          <div
            key={index}
            className="card card-hover p-6 group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${detail.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <detail.icon className={`w-6 h-6 bg-gradient-to-br ${detail.color} bg-clip-text`} style={{ color: 'inherit' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 font-medium mb-1">{detail.label}</p>
                <p className={`text-lg font-semibold text-gray-900 truncate ${detail.capitalize ? 'capitalize' : ''}`}>
                  {detail.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Account Status Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Account Status: Active</h3>
            <p className="text-sm text-gray-500">Your account is in good standing with full access to all features.</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Profile;
