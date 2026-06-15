import { useEffect, useState } from 'react';
import api from '@/api/client';

interface AdminOverview {
  stats: {
    totalUsers: number;
    totalSessions: number;
    totalResumes: number;
    averageScore: number;
  };
  byCategory: Record<string, number>;
}

export function AdminPage() {
  const [data, setData] = useState<AdminOverview | null>(null);

  useEffect(() => {
    void api.get('/admin/overview').then((response) => setData(response.data));
  }, []);

  return (
    <div className="card space-y-6 max-w-5xl">
      <div className="section-title">Admin dashboard</div>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5"><div className="text-sm text-slate-400">Users</div><div className="mt-2 text-3xl font-semibold text-white">{data?.stats.totalUsers ?? 0}</div></div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5"><div className="text-sm text-slate-400">Sessions</div><div className="mt-2 text-3xl font-semibold text-white">{data?.stats.totalSessions ?? 0}</div></div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5"><div className="text-sm text-slate-400">Resumes</div><div className="mt-2 text-3xl font-semibold text-white">{data?.stats.totalResumes ?? 0}</div></div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5"><div className="text-sm text-slate-400">Avg score</div><div className="mt-2 text-3xl font-semibold text-white">{data?.stats.averageScore ?? 0}</div></div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm font-semibold text-white">By category</div>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-300">
          {Object.entries(data?.byCategory ?? {}).map(([category, count]) => (
            <span key={category} className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1">{category}: {count}</span>
          ))}
        </div>
      </div>
    </div>
  );
}