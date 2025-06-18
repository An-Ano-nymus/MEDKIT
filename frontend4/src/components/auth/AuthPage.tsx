import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import DoctorSignupForm from './DoctorSignupForm';
import DoctorLoginForm from './DoctorLoginForm';
import { useAuth } from '../../context/AuthContext';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'user' | 'doctor'>('user');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side: Illustration */}
      <div className="hidden lg:flex  items-center justify-center p-10">
        <img
          src="https://img.freepik.com/premium-vector/ai-medicine-concept-healthcare-professional-interacts-with-robotic-assistant-patient-engagement_277904-36871.jpg?ga=GA1.1.1198765643.1750097404&semt=ais_hybrid&w=740"
          alt="Healthcare Illustration"
          className="max-w-[80%] h-auto rounded-xl drop-shadow-xl"
        />
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex items-center justify-center px-6 sm:px-12 py-10 bg-white">
        <div className="w-full max-w-md space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="text-center text-sm text-gray-600">
            {isLogin
              ? 'Access your medical dashboard'
              : 'Start managing your health journey'}
          </p>

          {/* User Type Toggle */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setUserType('user')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                userType === 'user'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Enter as User
            </button>
            <button
              onClick={() => setUserType('doctor')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                userType === 'doctor'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Enter as Doctor
            </button>
          </div>

          {/* Auth Form Logic */}
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 space-y-4 border border-gray-100">
            {isLogin ? (
              userType === 'user' ? (
                <LoginForm onSignupClick={toggleAuthMode} userType="user" />
              ) : (
                <DoctorLoginForm onSignupClick={toggleAuthMode} />
              )
            ) : userType === 'user' ? (
              <SignupForm onLoginClick={toggleAuthMode} />
            ) : (
              <DoctorSignupForm onLoginClick={toggleAuthMode} />
            )}
          </div>

          {/* Auth Mode Toggle */}
          <div className="text-center text-sm text-gray-500">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={toggleAuthMode}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={toggleAuthMode}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
