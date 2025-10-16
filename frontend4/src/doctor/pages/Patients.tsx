import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { fetchWithCredentials } from '../../utils/api';

type Appointment = {
	_id: string;
	username: string;
	phone: string;
	date: string;
};

export function DoctorPatients() {
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
				setError(e instanceof Error ? e.message : 'Failed to load patients');
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const patients = useMemo(() => {
		const map = new Map<string, { name: string; phone: string; lastVisit: string }>();
		for (const a of appointments) {
			const key = `${a.username}-${a.phone}`;
			const lastVisit = a.date;
			const existing = map.get(key);
			if (!existing || new Date(lastVisit) > new Date(existing.lastVisit)) {
				map.set(key, { name: a.username, phone: a.phone, lastVisit });
			}
		}
		return Array.from(map.values());
	}, [appointments]);

		return (
		<Card>
			<CardHeader>
					<CardTitle>Patients</CardTitle>
			</CardHeader>
			<CardContent>
					{loading ? (
					<div className="py-6 text-sm text-gray-500">Loading...</div>
					) : error ? (
					<div className="py-6 text-sm text-red-600">{error}</div>
					) : patients.length === 0 ? (
					<div className="py-6 text-sm text-gray-500">No patients yet.</div>
					) : (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<input
									className="border px-3 py-2 rounded w-64"
									placeholder="Search name or phone"
									value={query}
									onChange={(e)=>{ setQuery(e.target.value); setPage(1); }}
								/>
								<div className="text-sm text-gray-600">Showing {(page-1)*pageSize+1}-{Math.min(page*pageSize, filtered().length)} of {filtered().length}</div>
							</div>
							<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Phone</TableHead>
									<TableHead>Last Visit</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
												{paged().map((p) => (
									<TableRow key={`${p.name}-${p.phone}`}>
										<TableCell>{p.name}</TableCell>
										<TableCell>{p.phone}</TableCell>
										<TableCell>{p.lastVisit}</TableCell>
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
	);

					function filtered() {
						const q = query.toLowerCase();
						return patients.filter(p => p.name.toLowerCase().includes(q) || p.phone.toLowerCase().includes(q));
					}
					function paged() {
						const f = filtered();
						const start = (page-1)*pageSize;
						return f.slice(start, start + pageSize);
					}
}
