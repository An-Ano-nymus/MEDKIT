import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { useDoctorAuth } from '../../context/useDoctorAuth';

interface DoctorLoginFormProps {
  onSignupClick: () => void;
}
const DoctorLoginForm: React.FC<DoctorLoginFormProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useDoctorAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const result = await login(email, password);
      if (result.success) {
        setStatus('✅ Login successful!');
        navigate('/doctor');
      } else {
        setStatus(`❌ ${result.error || 'Login failed'}`);
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setStatus('❌ Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase mb-1 tracking-wide">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase mb-1 tracking-wide">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          />
        </div>
      </div>

      {status && (
        <p className={`text-sm ${status.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {status}
        </p>
      )}

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Logging in...' : 'Login as Doctor'}
      </Button>

      {/* <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">Don't have an account? </span>
        <button
          type="button"
          className="text-blue-600 hover:underline text-sm"
          onClick={onSignupClick}
        >
          Sign up
        </button>
      </div> */}
    </form>
  );
};

export default DoctorLoginForm;
