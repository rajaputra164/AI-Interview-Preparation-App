import { useState } from 'react';
import api from '@/api/client';

interface CodingChallenge {
  _id?: string;
  title: string;
  description: string;
  starterCode: string;
  languageId: number;
  testCases: Array<{ input: string; expectedOutput: string }>;
}

export function CodingPage() {
  const [challenge, setChallenge] = useState<CodingChallenge | null>(null);
  const [technology, setTechnology] = useState('JavaScript');
  const [difficulty, setDifficulty] = useState('medium');
  const [sourceCode, setSourceCode] = useState('function solve() {\n  return 0;\n}');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadChallenge() {
    setLoading(true);
    const response = await api.get('/coding/challenge', {
      params: { technology, difficulty }
    });
    setChallenge(response.data.challenge);
    setSourceCode(response.data.challenge.starterCode);
    setOutput('');
    setLoading(false);
  }

  async function runCode() {
    if (!challenge) {
      return;
    }

    setLoading(true);
    const response = await api.post('/coding/run', {
      languageId: challenge.languageId,
      sourceCode,
      stdin: challenge.testCases[0]?.input,
      testCases: challenge.testCases,
      expectedOutput: challenge.testCases[0]?.expectedOutput
    });
    setOutput(JSON.stringify(response.data.result, null, 2));
    setLoading(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="card space-y-4">
        <div className="section-title">Challenge builder</div>
        <input className="input" value={technology} onChange={(event) => setTechnology(event.target.value)} placeholder="JavaScript" />
        <select className="input" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button className="button-primary w-full" disabled={loading} onClick={loadChallenge} type="button">
          {loading ? 'Loading...' : 'Generate coding challenge'}
        </button>

        {challenge ? (
          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xl font-semibold text-white">{challenge.title}</div>
            <div className="text-sm leading-6 text-slate-300">{challenge.description}</div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Judge0 language id: {challenge.languageId}</div>
          </div>
        ) : null}
      </div>

      <div className="card space-y-4">
        <div className="section-title">Online editor</div>
        <textarea className="input min-h-96 font-mono text-sm leading-6" value={sourceCode} onChange={(event) => setSourceCode(event.target.value)} />
        <div className="flex flex-wrap gap-3">
          <button className="button-primary" disabled={!challenge || loading} onClick={runCode} type="button">
            {loading ? 'Running...' : 'Execute code'}
          </button>
        </div>
        <pre className="scrollbar-thin overflow-auto rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm text-emerald-200">{output || 'Run code to see Judge0 output and validation results.'}</pre>
      </div>
    </div>
  );
}