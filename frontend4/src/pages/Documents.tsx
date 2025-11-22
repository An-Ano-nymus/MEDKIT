import React from 'react';
import { FileText, Calendar as CalendarIcon } from 'lucide-react';
import { API_ORIGIN } from '../utils/api';

const Documents: React.FC = () => {
  const [reports, setReports] = React.useState<Array<{ _id: string; fileName?: string; summary: string; createdAt?: string }>>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_ORIGIN}/api/reports`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Failed');
        setReports(data.reports || []);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load documents';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
        <p className="text-gray-600">View saved report summaries</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : reports.length === 0 ? (
          <p className="text-sm text-gray-500">No documents saved yet.</p>
        ) : (
          <ul className="space-y-4">
            {reports.map((r) => (
              <li key={r._id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">{r.fileName || 'Report'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}
                  </div>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-3 rounded">{r.summary}</pre>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Documents;
