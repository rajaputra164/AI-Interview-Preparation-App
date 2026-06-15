import { FormEvent, useEffect, useState } from 'react';
import api from '@/api/client';

interface ResumeAnalysis {
  _id: string;
  fileName: string;
  atsScore: number;
  missingSkills: string[];
  suggestions: string[];
}

export function ResumePage() {
  const [history, setHistory] = useState<ResumeAnalysis[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void api.get('/resumes/history').then((response) => setHistory(response.data.history));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedFile) {
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', selectedFile);
    const response = await api.post('/resumes/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setAnalysis(response.data.analysis);
    const refreshed = await api.get('/resumes/history');
    setHistory(refreshed.data.history);
    setLoading(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <form className="card space-y-4" onSubmit={handleSubmit}>
        <div className="section-title">Resume analyzer</div>
        <input className="input" accept="application/pdf" type="file" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} />
        <button className="button-primary w-full" disabled={!selectedFile || loading} type="submit">
          {loading ? 'Analyzing...' : 'Upload PDF resume'}
        </button>
        {analysis ? (
          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-4xl font-semibold text-emerald-300">{analysis.atsScore}</div>
            <div className="text-sm text-slate-300">ATS compatibility score</div>
            <div className="text-sm text-slate-200">Missing skills: {analysis.missingSkills.length ? analysis.missingSkills.join(', ') : 'None detected'}</div>
            <div className="text-sm text-slate-300">Suggestions: {analysis.suggestions.join(' · ')}</div>
          </div>
        ) : null}
      </form>

      <section className="card space-y-4">
        <div className="section-title">Analysis history</div>
        <div className="space-y-3">
          {history.length ? history.map((item) => (
            <div key={item._id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-white">{item.fileName}</div>
                  <div className="text-sm text-slate-400">Missing skills: {item.missingSkills.join(', ') || 'None'}</div>
                </div>
                <div className="text-2xl font-semibold text-emerald-300">{item.atsScore}</div>
              </div>
            </div>
          )) : <div className="text-sm text-slate-400">Upload a resume to see your scoring history.</div>}
        </div>
      </section>
    </div>
  );
}