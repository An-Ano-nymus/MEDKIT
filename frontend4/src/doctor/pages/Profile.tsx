import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { fetchWithCredentials } from '../../utils/api';
import { useToast } from '../../components/common/useToast';

export function DoctorProfile() {
	const [form, setForm] = useState({ name: '', phone: '', location: '', experience: '', specialty: '' });
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [status, setStatus] = useState<string | null>(null);
		const { show } = useToast();

	useEffect(() => {
		(async () => {
			try {
				const res = await fetchWithCredentials('/doctor/me');
				const d = res?.doctor || {};
				setForm({
					name: d.name || '',
					phone: d.phone || '',
					location: d.location || '',
					experience: d.experience || '',
					specialty: d.specialty || '',
				});
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
	};

	const save = async () => {
		setSaving(true);
		setStatus(null);
		try {
			const res = await fetchWithCredentials('/doctor/profile', {
				method: 'PUT',
				body: JSON.stringify(form),
			});
					if (res.success) { setStatus('Saved'); show('Profile saved', 'success'); }
				} catch {
					setStatus('Failed to save'); show('Failed to save profile', 'error');
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <div className="text-sm text-gray-500">Loading...</div>;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input name="name" value={form.name} onChange={onChange} placeholder="Full Name" />
					<Input name="phone" value={form.phone} onChange={onChange} placeholder="Phone" />
					<Input name="location" value={form.location} onChange={onChange} placeholder="Location" />
					<Input name="experience" value={form.experience} onChange={onChange} placeholder="Experience (years)" />
					<Input name="specialty" value={form.specialty} onChange={onChange} placeholder="Specialty" />
				</div>
				<div className="mt-4 flex items-center gap-3">
					<Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
					{status && <span className="text-sm text-gray-600">{status}</span>}
				</div>
			</CardContent>
		</Card>
	);
}
