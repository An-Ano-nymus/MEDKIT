import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Calendar, Users, Clock, TrendingUp } from 'lucide-react';
import { fetchWithCredentials } from '../../utils/api';

type Appt = { _id: string; username: string; date: string; time: string };

export function DoctorDashboard() {
  const [doctorName, setDoctorName] = useState('Doctor');
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState('');
  const [appointments, setAppointments] = useState<Appt[]>([]);

  useEffect(() => {
    (async () => {
      const me = await fetchWithCredentials('/doctor/me');
      if (me?.doctor) {
        setDoctorName(me.doctor.name || 'Doctor');
        setSpecialty(me.doctor.specialty || '');
        setExperience(me.doctor.experience || '');
      }
      const ap = await fetchWithCredentials('/doctor/appointments');
      setAppointments(ap.appointments || []);
    })();
  }, []);

  const todayStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const todaysCount = useMemo(() => appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length, [appointments]);
  const uniquePatients = useMemo(() => new Set(appointments.map(a => a.username)).size, [appointments]);
  const upcoming = useMemo(() => appointments.slice(0, 5), [appointments]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{doctorName}</h2>
              <p className="text-gray-600 dark:text-gray-300">{specialty || 'Specialist'}{experience ? ` • ${experience} years experience` : ''}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Today's Date</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{todayStr}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{todaysCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{uniquePatients}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Available Slots</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">—</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">This Month</p>
                <p className="text-2xl font-bold text-gray-900">+12%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcoming.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell className="font-medium">{appointment.username}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>
                    <Badge variant="info">Upcoming</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
