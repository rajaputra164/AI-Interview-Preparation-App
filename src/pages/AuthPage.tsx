import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

export function AuthPage() {
  const navigate = useNavigate();
  const { token, login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  useEffect(() => {
    if (token) {
      navigate('/app');
    }
  }, [token, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, role: form.role };
      const response = await api.post(endpoint, payload);
      const authUser = response.data.user;

      if (mode === 'login') {
        login(response.data.token, authUser);
      } else {
        signup(response.data.token, authUser);
      }

      navigate('/app');
    } catch (requestError) {
      setError('Unable to authenticate. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-4 text-white lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(6,10,19,0.72)] shadow-glow lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative flex flex-col justify-between overflow-hidden bg-hero-grid p-8 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(47,200,145,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(255,138,101,0.14),transparent_22%)]" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="section-title">AI Interview Platform</div>
              <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight lg:text-6xl">Practice interviews, score answers, and grow with feedback that feels personal.</h1>
            </div>
            <ThemeToggle />
          </div>
          <div className="relative grid gap-4 md:grid-cols-3">
            {[
              ['AI Question Generator', 'Technical, HR, and aptitude prompts tailored to role and difficulty.'],
              ['Resume Intelligence', 'ATS scoring, missing skill detection, and improvement guidance.'],
              ['Performance Analytics', 'Track progress with charts, history, and downloadable reports.']
            ].map(([title, description]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="text-lg font-semibold">{title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-300">{description}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center p-6 lg:p-10">
          <form className="card w-full max-w-lg space-y-5" onSubmit={handleSubmit}>
            <div>
              <div className="section-title">{mode === 'login' ? 'Welcome back' : 'Create account'}</div>
              <h2 className="mt-3 text-3xl font-semibold text-white">{mode === 'login' ? 'Sign in to continue' : 'Start your AI interview journey'}</h2>
            </div>

            {mode === 'signup' ? (
              <label className="block space-y-2">
                <span className="text-sm text-slate-300">Name</span>
                <input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Aarav Sharma" />
              </label>
            ) : null}

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Email</span>
              <input className="input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Password</span>
              <input className="input" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="••••••••" />
            </label>

            {mode === 'signup' ? (
              <label className="block space-y-2">
                <span className="text-sm text-slate-300">Role</span>
                <select className="input" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                  <option value="student">Student</option>
                  <option value="job-seeker">Job Seeker</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            ) : null}

            {error ? <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

            <button className="button-primary w-full" disabled={loading} type="submit">
              {loading ? 'Working...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>

            <button className="button-secondary w-full" type="button" onClick={() => setMode((current) => (current === 'login' ? 'signup' : 'login'))}>
              {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}