import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { fetchWithCredentials } from '../../utils/api';

type Appointment = {
	_id: string;
	username: string;
	phone: string;
	doctor: string;
	doctorId: string;
	date: string;
	time: string;
	createdAt: string;
};

export function DoctorAppointments() {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const pageSize = 10;

	useEffect(() => {
		(async () => {
			try {
				const res = await fetchWithCredentials('/doctor/appointments');
				setAppointments(res.appointments || []);
			} catch (e) {
				setError(e instanceof Error ? e.message : 'Failed to load appointments');
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Appointments</CardTitle>
				</CardHeader>
				<CardContent>
								{loading ? (
						<div className="py-6 text-sm text-gray-500">Loading...</div>
					) : error ? (
						<div className="py-6 text-sm text-red-600">{error}</div>
					) : appointments.length === 0 ? (
						<div className="py-6 text-sm text-gray-500">No appointments yet.</div>
					) : (
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<input
												className="border px-3 py-2 rounded w-64"
												placeholder="Search patient or phone"
												value={query}
												onChange={(e) => { setQuery(e.target.value); setPage(1); }}
											/>
											<div className="text-sm text-gray-600">
												Showing {(page-1)*pageSize+1}-{Math.min(page*pageSize, filtered().length)} of {filtered().length}
											</div>
										</div>
										<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Patient</TableHead>
										<TableHead>Phone</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Time</TableHead>
										<TableHead>Booked</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									  {paged().map((a) => (
										<TableRow key={a._id}>
											<TableCell>{a.username}</TableCell>
											<TableCell>{a.phone}</TableCell>
											<TableCell>{a.date}</TableCell>
											<TableCell>{a.time}</TableCell>
											<TableCell>{new Date(a.createdAt).toLocaleString()}</TableCell>
										</TableRow>
									))}
								</TableBody>
											</Table>
											</div>
											<div className="flex items-center justify-end gap-2">
												<button className="px-3 py-1 border rounded" disabled={page===1} onClick={()=>setPage((p)=>Math.max(1,p-1))}>Prev</button>
												<button className="px-3 py-1 border rounded" disabled={page*pageSize>=filtered().length} onClick={()=>setPage((p)=>p+1)}>Next</button>
											</div>
										</div>
					)}
				</CardContent>
			</Card>
		</div>
	);

					function filtered() {
						const q = query.toLowerCase();
						return appointments.filter(a => a.username.toLowerCase().includes(q) || a.phone.toLowerCase().includes(q));
					}
					function paged() {
						const f = filtered();
						const start = (page-1)*pageSize;
						return f.slice(start, start + pageSize);
					}
}
