import React from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_ORIGIN } from '../../utils/api';

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

type AppointmentDisplay = { id: string; title: string; doctor: string; date: string; time: string; location: string };
const AppointmentsCard: React.FC = () => {
  const [appointments, setAppointments] = React.useState<AppointmentDisplay[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_ORIGIN}/appointments/user`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Failed');
        // Map to display format; title is not in model, so construct a friendly title
        const mapped: AppointmentDisplay[] = (data.appointments || []).map((a: { _id: string; doctor: string; date: string; time: string }) => ({
          id: a._id,
          title: 'Appointment',
          doctor: a.doctor,
          date: a.date,
          time: a.time,
          location: 'Medical Center'
        }));
        // Show only next 3
        setAppointments(mapped.slice(0, 3));
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
        <Link to="/appointments" className="text-sm text-blue-600 hover:text-blue-800">
          Schedule new
        </Link>
      </div>
      <div className="divide-y divide-gray-100">
        {loading ? (
          <p className="py-4 text-sm text-gray-500">Loading...</p>
        ) : error ? (
          <p className="py-4 text-sm text-red-600">{error}</p>
        ) : appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentItem key={appointment.id} {...appointment} />
          ))
        ) : (
          <p className="py-4 text-sm text-gray-500">No upcoming appointments. Schedule your next visit.</p>
        )}
      </div>
    </div>
  );
};

export default AppointmentsCard;