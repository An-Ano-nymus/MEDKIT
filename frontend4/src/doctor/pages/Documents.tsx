import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { fetchWithCredentials, API_ORIGIN } from '../../utils/api';

export function DoctorDocuments() {
	const [degreeUrl, setDegreeUrl] = useState<string | null>(null);
	const [licenseUrl, setLicenseUrl] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			const res = await fetchWithCredentials('/doctor/me');
			const d = res?.doctor;
			if (d?.degreeImage) setDegreeUrl(pathFromBackend(d.degreeImage));
			if (d?.licenseImage) setLicenseUrl(pathFromBackend(d.licenseImage));
		})();
	}, []);

	const pathFromBackend = (p: string) => {
		const normalized = p.replace(/\\/g, '/');
		const marker = 'uploads/';
		const idx = normalized.lastIndexOf(marker);
		const rel = idx >= 0 ? normalized.slice(idx + marker.length) : normalized;
		return `${API_ORIGIN}/api/protected-uploads/${rel}`;
	};

		return (
		<Card>
			<CardHeader>
				<CardTitle>Documents</CardTitle>
			</CardHeader>
			<CardContent>
					<div className="space-y-4">
					<div>
						<div className="font-medium">Degree</div>
							{degreeUrl ? (
								<div className="mt-2">
									<div className="w-full max-w-sm aspect-[4/3] overflow-hidden rounded border">
										<img src={degreeUrl} alt="Degree" className="w-full h-full object-cover" />
									</div>
									<a className="text-blue-600 underline text-sm" href={degreeUrl} target="_blank" rel="noreferrer">Open full</a>
								</div>
							) : (
								<div className="text-sm text-gray-500">Not uploaded</div>
							)}
					</div>
					<div>
						<div className="font-medium">License</div>
							{licenseUrl ? (
								<div className="mt-2">
									<div className="w-full max-w-sm aspect-[4/3] overflow-hidden rounded border">
										<img src={licenseUrl} alt="License" className="w-full h-full object-cover" />
									</div>
									<a className="text-blue-600 underline text-sm" href={licenseUrl} target="_blank" rel="noreferrer">Open full</a>
								</div>
							) : (
								<div className="text-sm text-gray-500">Not uploaded</div>
							)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
