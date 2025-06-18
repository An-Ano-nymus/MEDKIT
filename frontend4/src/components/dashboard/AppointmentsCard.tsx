import React from 'react';
import { Calendar } from 'lucide-react';

interface AppointmentItemProps {
  title: string;
  doctor: string;
  date: string;
  time: string;
  location: string;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ 
  title, doctor, date, time, location 
}) => {
  return (
    <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
      <div className="mr-3 mt-1">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Calendar className="h-5 w-5 text-blue-600" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500">Dr. {doctor}</p>
        <div className="mt-1 flex items-center">
          <span className="text-xs font-medium text-gray-700">{date}</span>
          <span className="mx-1 text-gray-400">•</span>
          <span className="text-xs text-gray-700">{time}</span>
          <span className="mx-1 text-gray-400">•</span>
          <span className="text-xs text-gray-700">{location}</span>
        </div>
      </div>
      <button className="ml-2 p-1 text-xs text-gray-500 hover:text-gray-700">
        Details
      </button>
    </div>
  );
};

const AppointmentsCard: React.FC = () => {
  const appointments = [
    {
      id: '1',
      title: 'Annual Physical Checkup',
      doctor: 'Sarah Johnson',
      date: 'Jun 15, 2025',
      time: '10:00 AM',
      location: 'Main Clinic'
    },
    {
      id: '2',
      title: 'Dental Cleaning',
      doctor: 'Michael Chen',
      date: 'Jun 22, 2025',
      time: '2:30 PM',
      location: 'Dental Center'
    },
    {
      id: '3',
      title: 'Eye Examination',
      doctor: 'Emily Rodriguez',
      date: 'Jul 05, 2025',
      time: '9:15 AM',
      location: 'Vision Care'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          Schedule new
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentItem 
              key={appointment.id} 
              {...appointment} 
            />
          ))
        ) : (
          <p className="py-4 text-sm text-gray-500">
            No upcoming appointments. Schedule your next visit.
          </p>
        )}
      </div>
    </div>
  );
};

export default AppointmentsCard;