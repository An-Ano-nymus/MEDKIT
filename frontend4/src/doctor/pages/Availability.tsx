import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { fetchWithCredentials } from '../../utils/api';
import { useToast } from '../../components/common/useToast';

export function DoctorAvailability() {
	const [slots, setSlots] = useState<string[]>([]);
	const [newSlot, setNewSlot] = useState('');
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [status, setStatus] = useState<string | null>(null);
		const { show } = useToast();

	useEffect(() => {
		(async () => {
			try {
				const res = await fetchWithCredentials('/doctor/me');
				if (res.loggedIn && Array.isArray(res.doctor?.availability)) {
					setSlots(res.doctor.availability);
				}
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const addSlot = () => {
		const s = newSlot.trim();
		if (!s) return;
		if (!slots.includes(s)) setSlots([...slots, s]);
		setNewSlot('');
	};

	const removeSlot = (s: string) => setSlots(slots.filter((x) => x !== s));

	const save = async () => {
		setSaving(true);
		setStatus(null);
		try {
			const res = await fetchWithCredentials('/doctor/availability', {
				method: 'PUT',
				body: JSON.stringify({ availability: slots }),
			});
			if (res.success) { setStatus('Saved'); show('Availability saved', 'success'); }
			} catch {
			setStatus('Failed to save'); show('Failed to save availability', 'error');
		} finally {
			setSaving(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Availability</CardTitle>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className="py-6 text-sm text-gray-500">Loading...</div>
				) : (
					<div className="space-y-4">
						<div className="flex gap-2">
							<Input
								placeholder="e.g. Mon 10:00-12:00"
								value={newSlot}
								onChange={(e) => setNewSlot(e.target.value)}
							/>
							<Button onClick={addSlot}>Add</Button>
						</div>
						<ul className="space-y-2">
							{slots.map((s) => (
								<li key={s} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
									<span>{s}</span>
									<Button variant="outline" onClick={() => removeSlot(s)}>Remove</Button>
								</li>
							))}
						</ul>
						<div className="flex items-center gap-3">
							<Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
							{status && <span className="text-sm text-gray-600">{status}</span>}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
