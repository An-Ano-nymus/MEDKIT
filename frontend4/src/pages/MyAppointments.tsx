import React from 'react';
import { API_ORIGIN } from '../utils/api';

interface Appt { _id: string; doctor: string; date: string; time: string; }

const pageSize = 5;

const MyAppointments: React.FC = () => {
  const [items, setItems] = React.useState<Appt[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [rescheduleId, setRescheduleId] = React.useState<string | null>(null);
  const [newDate, setNewDate] = React.useState('');
  const [newTime, setNewTime] = React.useState('');

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_ORIGIN}/appointments/user`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load appointments');
      setItems(data.appointments || []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load appointments';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { load(); }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const startIdx = (page - 1) * pageSize;
  const slice = items.slice(startIdx, startIdx + pageSize);

  const cancel = async (id: string) => {
    if (!confirm('Cancel this appointment?')) return;
    const res = await fetch(`${API_ORIGIN}/appointments/${id}`, { method: 'DELETE', credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      alert(data.error || 'Failed to cancel');
      return;
    }
    await load();
  };

  const beginReschedule = (id: string, date: string, time: string) => {
    setRescheduleId(id);
    setNewDate(date);
    setNewTime(time);
  };

  const saveReschedule = async () => {
    if (!rescheduleId) return;
    const res = await fetch(`${API_ORIGIN}/appointments/${rescheduleId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: newDate, time: newTime })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      alert(data.error || 'Failed to reschedule');
      return;
    }
    setRescheduleId(null);
    await load();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600">Manage your bookings</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : slice.length === 0 ? (
          <p className="text-sm text-gray-500">No appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-4">Doctor</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Time</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slice.map((a) => (
                  <tr key={a._id} className="border-t">
                    <td className="py-2 pr-4">{a.doctor}</td>
                    <td className="py-2 pr-4">{a.date}</td>
                    <td className="py-2 pr-4">{a.time}</td>
                    <td className="py-2 pr-4 space-x-2">
                      <button className="text-blue-600" onClick={() => beginReschedule(a._id, a.date, a.time)}>Reschedule</button>
                      <button className="text-red-600" onClick={() => cancel(a._id)}>Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>

        {rescheduleId && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-2">Reschedule Appointment</h3>
            <div className="flex items-center space-x-2">
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="border rounded px-2 py-1" />
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="border rounded px-2 py-1" />
              <button onClick={saveReschedule} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
              <button onClick={() => setRescheduleId(null)} className="px-3 py-1 border rounded">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
