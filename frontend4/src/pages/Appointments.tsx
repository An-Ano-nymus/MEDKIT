import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Sidebar from '../components/dashboard/Sidebar';

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  location: string;
  availability: string[];
  experience: string;
  image?: string;
}

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  useEffect(() => {
    fetch('http://localhost:5000/api/doctors')
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(err => console.error('Failed to fetch doctors:', err));
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getStartDay = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startDay = getStartDay(currentYear, currentMonth);

  const sendOtp = async () => {
    if (!phoneNumber) return;
    setBookingStatus('⏳ Sending OTP...');
    try {
      const res = await fetch('http://localhost:5000/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setBookingStatus('✅ OTP sent. Please enter it to verify.');
      } else {
        setBookingStatus(data?.error || '❌ Failed to send OTP.');
      }
    } catch {
      setBookingStatus('❌ Server error while sending OTP.');
    }
  };

  const verifyOtp = async () => {
    if (!otp) return;
    setBookingStatus('⏳ Verifying OTP...');
    try {
      const res = await fetch('http://localhost:5000/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, otp })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpVerified(true);
        setBookingStatus('✅ OTP verified. You can now book.');
      } else {
        setBookingStatus(data?.error || '❌ Invalid OTP.');
      }
    } catch {
      setBookingStatus('❌ OTP verification failed.');
    }
  };

  const handleBooking = async () => {
    const doctorData = doctors.find(d => d._id === selectedDoctor);
    const doctorName = doctorData?.name;

    if (!selectedDate || !selectedDoctor || !selectedTime || !phoneNumber || !doctorName) {
      setBookingStatus('❌ Please complete all fields');
      return;
    }

    setBookingStatus('⏳ Booking your appointment...');

    try {
      const res = await fetch('http://localhost:5000/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor: doctorName,
          doctorId: selectedDoctor,
          date: selectedDate,
          time: selectedTime,
          phone: phoneNumber,
          username: user?.name
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookingStatus('✅ Appointment booked! SMS sent.');
        setSelectedDate('');
        setSelectedDoctor('');
        setSelectedTime('');
        setPhoneNumber('');
        setOtp('');
        setOtpSent(false);
        setOtpVerified(false);
      } else {
        setBookingStatus(`❌ Failed: ${data.error}`);
      }
    } catch {
      setBookingStatus('❌ Server error while booking.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader sidebarOpen={false} setSidebarOpen={() => {}} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Book an Appointment</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Calendar */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Select Date</h2>
                    <div className="space-x-2 text-sm">
                      <button onClick={() => {
                        if (currentMonth === 0) {
                          setCurrentMonth(11);
                          setCurrentYear(currentYear - 1);
                        } else {
                          setCurrentMonth(currentMonth - 1);
                        }
                      }} className="px-3 py-1 bg-gray-200 rounded">←</button>
                      <span className="font-medium">{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                      <button onClick={() => {
                        if (currentMonth === 11) {
                          setCurrentMonth(0);
                          setCurrentYear(currentYear + 1);
                        } else {
                          setCurrentMonth(currentMonth + 1);
                        }
                      }} className="px-3 py-1 bg-gray-200 rounded">→</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-sm text-gray-600 mb-2 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="font-medium">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {Array.from({ length: startDay }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1;
                      const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`p-2 rounded-lg w-full hover:bg-blue-100 ${
                            selectedDate === dateStr ? 'bg-blue-600 text-white' : 'text-gray-700'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Doctors */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Select Doctor</h2>
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <div
                        key={doctor._id}
                        className={`p-4 rounded-lg border cursor-pointer transition ${
                          selectedDoctor === doctor._id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedDoctor(doctor._id)}
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={doctor.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCXMzWLjeWhuFZrBDCq3rweTGm3RAx0VCgIQ&s'}
                            alt={doctor.name}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                            <p className="text-sm text-gray-500">{doctor.specialty}</p>
                            <p className="text-sm text-gray-500">{doctor.location}</p>
                            <p className="text-sm text-gray-400">Experience: {doctor.experience}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time */}
                {selectedDoctor && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Select Time</h2>
                    <div className="grid grid-cols-3 gap-3">
                      {doctors.find((d) => d._id === selectedDoctor)?.availability.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`p-2 text-center rounded-lg border transition ${
                            selectedTime === slot
                              ? 'bg-blue-100 border-blue-500 text-blue-600'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Panel */}
              <div className="bg-white rounded-xl shadow-lg p-6 h-fit space-y-4">
                <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
                <div className="space-y-3 text-gray-700 text-sm">
                  <div className="flex items-center space-x-2"><Calendar className="w-5 h-5" /><span>{selectedDate || 'Select a date'}</span></div>
                  <div className="flex items-center space-x-2"><User className="w-5 h-5" /><span>{doctors.find((d) => d._id === selectedDoctor)?.name || 'Select a doctor'}</span></div>
                  <div className="flex items-center space-x-2"><Clock className="w-5 h-5" /><span>{selectedTime || 'Select a time'}</span></div>
                  <div className="flex items-center space-x-2"><MapPin className="w-5 h-5" /><span>Medical Center</span></div>
                </div>

                <input type="tel" placeholder="Enter phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2 text-sm" />

                {otpSent && !otpVerified && (
                  <>
                    <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    <button onClick={verifyOtp} disabled={!otp} className={`w-full py-2 px-4 rounded-lg mt-2 ${otp ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                      Verify OTP
                    </button>
                  </>
                )}

                {!otpSent && (
                  <button onClick={sendOtp} disabled={!phoneNumber} className={`w-full py-2 px-4 rounded-lg ${phoneNumber ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                    Send OTP
                  </button>
                )}

                {otpVerified && (
                  <button onClick={handleBooking} className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    Confirm Booking
                  </button>
                )}

                {bookingStatus && <p className="text-sm text-blue-700 mt-2">{bookingStatus}</p>}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Appointments;
