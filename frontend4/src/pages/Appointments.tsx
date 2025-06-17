import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';



interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  location: string;
  availability: string[];
  experience: string;
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

  useEffect(() => {
    fetch('http://localhost:5000/api/doctors')
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(err => console.error('Failed to fetch doctors:', err));
  }, []);

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
        setBookingStatus('✅ OTP verified. Now you can book your appointment.');
      } else {
        setBookingStatus(data?.error || '❌ Invalid OTP. Please try again.');
      }
    } catch {
      setBookingStatus('❌ Failed to verify OTP.');
    }
  };

  const handleBooking = async () => {
    const doctorData = doctors.find(d => d._id === selectedDoctor);
    const doctorName = doctorData?.name;

    if (!selectedDate || !selectedDoctor || !selectedTime || !phoneNumber || !doctorName) {
      setBookingStatus('❌ Missing required info');
      return;
    }

    setBookingStatus('⏳ Booking appointment...');

    try {
        // console.log(user?.name)
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
        setBookingStatus('✅ Appointment booked and SMS sent!');
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
      setBookingStatus('❌ Failed to connect to server.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Select Date</h2>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const formattedDay = day.toString().padStart(2, '0');
                const dateStr = `2024-06-${formattedDay}`;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-2 text-center rounded-lg hover:bg-blue-50 ${
                      selectedDate === dateStr ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Select Doctor</h2>
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className={`p-4 rounded-lg border cursor-pointer ${
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
                      <div className="text-sm text-gray-400">Experience: {doctor.experience}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedDoctor && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Select Time</h2>
              <div className="grid grid-cols-3 gap-3">
                {doctors
                  .find((d) => d._id === selectedDoctor)
                  ?.availability.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`p-2 text-center rounded-lg border ${
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

        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5" />
              <span>{selectedDate || 'Select a date'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5" />
              <span>{doctors.find((d) => d._id === selectedDoctor)?.name || 'Select a doctor'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5" />
              <span>{selectedTime || 'Select a time'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5" />
              <span>Medical Center</span>
            </div>

            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />

            {otpSent && !otpVerified && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={verifyOtp}
                  disabled={!otp}
                  className={`w-full py-2 px-4 rounded-lg ${
                    otp ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Verify OTP
                </button>
              </>
            )}

            {otpVerified && (
              <button
                onClick={handleBooking}
                className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm Booking
              </button>
            )}

            {!otpSent && (
              <button
                onClick={sendOtp}
                disabled={!phoneNumber}
                className={`w-full py-2 px-4 rounded-lg ${
                  phoneNumber ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Send OTP
              </button>
            )}

            {bookingStatus && <p className="text-sm text-blue-700 mt-2">{bookingStatus}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
