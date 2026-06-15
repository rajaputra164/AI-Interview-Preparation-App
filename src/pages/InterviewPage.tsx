import { FormEvent, useState } from 'react';
import api from '@/api/client';

interface SessionResponse {
  session: {
    _id: string;
    role: string;
    category: string;
    difficulty: string;
    questions: string[];
    answers: Array<{ question: string; answer?: string; score?: number; feedback?: string }>;
    status: string;
    overallScore?: number;
  };
  questions: Array<{ question: string; idealPoints: string[]; followUpHint?: string }>;
}

export function InterviewPage() {
  const [session, setSession] = useState<SessionResponse['session'] | null>(null);
  const [questions, setQuestions] = useState<SessionResponse['questions']>([]);
  const [answer, setAnswer] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string>('');

  async function startInterview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFeedback('');

    const formData = new FormData(event.currentTarget);
    const payload = {
      role: String(formData.get('role') ?? ''),
      skills: String(formData.get('skills') ?? '')
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
      category: String(formData.get('category') ?? 'technical'),
      difficulty: String(formData.get('difficulty') ?? 'medium'),
      count: 5
    };

    const response = await api.post('/interviews/sessions', payload);
    setSession(response.data.session);
    setQuestions(response.data.questions);
    setQuestionIndex(0);
    setAnswer('');
    setLoading(false);
  }

  async function submitAnswer() {
    if (!session) {
      return;
    }

    setLoading(true);
    const response = await api.post(`/interviews/sessions/${session._id}/answer`, {
      questionIndex,
      answer
    });

    setSession(response.data.session);
    setFeedback(response.data.latestEvaluation.feedback);
    if (!response.data.completed) {
      setQuestionIndex((value) => value + 1);
      setAnswer('');
    }
    setLoading(false);
  }

  const activeQuestion = questions[questionIndex];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <form className="card space-y-4" onSubmit={startInterview}>
        <div className="section-title">Mock interview setup</div>
        <input className="input" name="role" placeholder="Frontend Developer" />
        <input className="input" name="skills" placeholder="React, Node.js, SQL" />
        <select className="input" name="category" defaultValue="technical">
          <option value="technical">Technical</option>
          <option value="hr">HR</option>
          <option value="aptitude">Aptitude</option>
        </select>
        <select className="input" name="difficulty" defaultValue="medium">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button className="button-primary w-full" disabled={loading} type="submit">
          {loading ? 'Generating...' : 'Start mock interview'}
        </button>
      </form>

      <section className="card space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="section-title">Live session</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">{session ? session.role : 'No session started yet'}</h2>
          </div>
          {session ? <div className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300">{session.category} / {session.difficulty}</div> : null}
        </div>

        {activeQuestion ? (
          <div className="space-y-4">
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 text-lg text-white">Q{questionIndex + 1}. {activeQuestion.question}</div>
            <textarea className="input min-h-40 resize-y" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Type your response here..." />
            <button className="button-primary" disabled={loading || !answer.trim()} type="button" onClick={submitAnswer}>
              {loading ? 'Evaluating...' : 'Submit answer'}
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">Start a session to see the next AI-generated question. Answer feedback, scoring, and interview history will appear here.</div>
        )}

        {feedback ? <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">{feedback}</div> : null}
        {session?.overallScore ? <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 text-2xl font-semibold text-emerald-200">Final score: {session.overallScore}</div> : null}
      </section>
    </div>
  );
}