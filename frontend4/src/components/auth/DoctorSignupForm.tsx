import React, { useState } from 'react';
import Button from '../common/Button';

interface DoctorSignupFormProps {
  onLoginClick: () => void;
}

const DoctorSignupForm: React.FC<DoctorSignupFormProps> = ({ onLoginClick }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialty: '',
    licenseNumber: '',
    password: '',
    location: '',
    experience: '',
    availability: [] as string[],
  });

  const [degreeFile, setDegreeFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (slot: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter(s => s !== slot)
        : [...prev.availability, slot],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!degreeFile || !licenseFile) {
      setStatus('❌ Please upload both degree and license photo.');
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'availability' && Array.isArray(value)) {
        value.forEach(v => form.append('availability', v));
      } else {
        form.append(key, value as string);
      }
    });
    form.append('degreeFile', degreeFile);
    form.append('licenseFile', licenseFile);

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/doctor/signup', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('✅ Doctor registered successfully!');
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          specialty: '',
          licenseNumber: '',
          password: '',
          location: '',
          experience: '',
          availability: [],
        });
        setDegreeFile(null);
        setLicenseFile(null);
      } else {
        setStatus(`❌ ${data.error || 'Signup failed'}`);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setStatus('❌ Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {['name', 'phone', 'email', 'specialty', 'licenseNumber', 'password'].map((field) => (
          <div key={field}>
            <label className="block text-xs font-medium text-gray-700 uppercase mb-1 tracking-wide">
              {field === 'licenseNumber' ? 'License Number' : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase mb-1 tracking-wide">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase mb-1 tracking-wide">Experience</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Availability Checkboxes */}
      <div>
        <label className="block text-xs font-medium text-gray-700 uppercase mb-1 tracking-wide">Available Time Slots</label>
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map((slot) => (
            <label key={slot} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.availability.includes(slot)}
                onChange={() => handleAvailabilityChange(slot)}
                className="mr-2"
              />
              {slot}
            </label>
          ))}
        </div>
      </div>

      {/* File Uploads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase mb-1 tracking-wide">Upload Degree</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setDegreeFile(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 rounded-md text-sm file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase mb-1 tracking-wide">Upload License Photo</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 rounded-md text-sm file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      {/* Status */}
      {status && (
        <p className={`text-sm ${status.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {status}
        </p>
      )}

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Registering...' : 'Create Doctor Account'}
      </Button>

      {/* <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">Already have an account? </span>
        <button
          type="button"
          className="text-blue-600 hover:underline text-sm"
          onClick={onLoginClick}
        >
          Sign in
        </button>
      </div> */}
    </form>
  );
};

export default DoctorSignupForm;
