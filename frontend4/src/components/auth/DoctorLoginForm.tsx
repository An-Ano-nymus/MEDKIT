import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

interface DoctorLoginFormProps {
  onSignupClick: () => void;
}
// const navigate=useNavigate();

const DoctorLoginForm: React.FC<DoctorLoginFormProps> = ({ onSignupClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/doctor/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('✅ Login successful!');
        // localStorage.setItem('doctor', JSON.stringify(data.doctor));
        window.location.href = 'http://localhost:5174/dashboard';
        // You can also store doctor info in context/localStorage here
        console.log(data.doctor); // doctor info returned from backend
      } else {
        setStatus(`❌ ${data.error || 'Login failed'}`);
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
