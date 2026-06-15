import { useEffect, useState } from 'react';
import api from '@/api/client';

interface Recommendation {
  title: string;
  fitScore: number;
  reason: string;
  learningRoadmap: string[];
}

export function CareerPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [performanceScore, setPerformanceScore] = useState(0);

  useEffect(() => {
    void api.get('/career/recommendations').then((response) => {
      setRecommendations(response.data.recommendations);
      setPerformanceScore(response.data.performanceScore);
    });
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
      <div className="card space-y-4">
        <div className="section-title">Career guidance</div>
        <div className="text-5xl font-semibold text-emerald-300">{performanceScore}</div>
        <div className="text-sm text-slate-300">Current performance score from completed interviews</div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
          This module suggests career paths, certifications, and learning roadmaps based on your skills and interview history.
        </div>
      </div>

      <div className="card space-y-4">
        <div className="section-title">Recommended paths</div>
        <div className="space-y-4">
          {recommendations.length ? recommendations.map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-white">{item.title}</div>
                  <div className="text-sm text-slate-300">{item.reason}</div>
                </div>
                <div className="text-2xl font-semibold text-emerald-300">{item.fitScore}</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.learningRoadmap.map((step) => (
                  <span key={step} className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100">{step}</span>
                ))}
              </div>
            </div>
          )) : <div className="text-sm text-slate-400">Add profile skills and interview data to unlock recommendations.</div>}
        </div>
      </div>
    </div>
  );
}