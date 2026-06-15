import { useEffect, useState } from 'react';
import api from '@/api/client';
import { ScoreChart } from '@/components/ScoreChart';
import { StatCard } from '@/components/StatCard';

interface DashboardResponse {
  stats: {
    totalSessions: number;
    completedSessions: number;
    averageScore: number;
    atsScore: number;
  };
  interviewScores: Array<{ date: string; score: number; category: string }>;
  latestResume: { atsScore: number; missingSkills: string[] } | null;
  recentSessions: Array<{ role: string; category: string; difficulty: string; overallScore: number }>;
  strengths: string[];
  weaknesses: string[];
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    void api.get('/dashboard/summary').then((response) => setData(response.data));
  }, []);

  const labels = data?.interviewScores.map((entry) => new Date(entry.date).toLocaleDateString()) ?? [];
  const values = data?.interviewScores.map((entry) => entry.score) ?? [];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sessions" value={data?.stats.totalSessions ?? 0} description="All interview runs recorded" />
        <StatCard label="Completed" value={data?.stats.completedSessions ?? 0} description="Sessions with evaluated answers" />
        <StatCard label="Average score" value={data?.stats.averageScore ?? 0} description="Overall interview performance" />
        <StatCard label="ATS score" value={data?.stats.atsScore ?? 0} description="Latest resume compatibility score" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="card space-y-5">
          <div className="section-title">Performance over time</div>
          <ScoreChart labels={labels} values={values} />
        </div>

        <div className="card space-y-4">
          <div className="section-title">Focus areas</div>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-semibold text-emerald-300">Strengths</div>
              <ul className="mt-2 space-y-2 text-sm text-slate-200">
                {data?.strengths.map((item) => <li key={item}>• {item}</li>) ?? null}
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-orange-300">Weaknesses</div>
              <ul className="mt-2 space-y-2 text-sm text-slate-200">
                {data?.weaknesses.map((item) => <li key={item}>• {item}</li>) ?? null}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="card space-y-4">
          <div className="section-title">Resume snapshot</div>
          <div className="text-4xl font-semibold text-white">{data?.latestResume?.atsScore ?? 0}</div>
          <div className="text-sm text-slate-300">Latest ATS compatibility score</div>
          <div className="text-sm text-slate-300">
            Missing skills: {data?.latestResume?.missingSkills?.length ? data.latestResume.missingSkills.join(', ') : 'None identified yet'}
          </div>
        </div>

        <div className="card space-y-4">
          <div className="section-title">Recent activity</div>
          <div className="space-y-3">
            {data?.recentSessions.length ? data.recentSessions.map((session) => (
              <div key={`${session.role}-${session.category}-${session.difficulty}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-white">{session.role}</div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{session.category} • {session.difficulty}</div>
                  </div>
                  <div className="text-2xl font-semibold text-emerald-300">{session.overallScore ?? 0}</div>
                </div>
              </div>
            )) : <div className="text-sm text-slate-400">No sessions yet.</div>}
          </div>
        </div>
      </section>
    </div>
  );
}