import { NavLink, Outlet } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { to: '/app', label: 'Dashboard' },
  { to: '/app/interviews', label: 'Mock Interview' },
  { to: '/app/resume', label: 'Resume Analyzer' },
  { to: '/app/coding', label: 'Coding Lab' },
  { to: '/app/career', label: 'Career Guidance' },
  { to: '/app/profile', label: 'Profile' },
  { to: '/app/admin', label: 'Admin' }
];

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 p-4 lg:p-6">
        <aside className="glass-panel hidden w-72 flex-col rounded-[2rem] p-5 lg:flex">
          <div className="mb-8 space-y-2">
            <div className="section-title">AI Interview Platform</div>
            <h1 className="text-2xl font-semibold">Prepare like a candidate, perform like a pro.</h1>
            <p className="text-sm leading-6 text-slate-300">AI-generated questions, answer evaluation, resume analysis, coding practice, and career planning in one workspace.</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-4 pt-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Signed in as</div>
              <div className="mt-2 text-sm font-semibold">{user?.name ?? 'Guest'}</div>
              <div className="text-xs text-slate-400">{user?.email ?? 'No email loaded'}</div>
            </div>
            <button className="button-secondary w-full" onClick={logout} type="button">
              Log out
            </button>
          </div>
        </aside>

        <main className="flex min-h-screen flex-1 flex-col gap-6">
          <header className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-[2rem] px-5 py-4 lg:px-6">
            <div>
              <div className="section-title">Interview lab</div>
              <div className="text-lg font-semibold text-white">Personalized AI feedback, scoring, and progress analytics</div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button className="button-secondary lg:hidden" onClick={logout} type="button">Log out</button>
            </div>
          </header>

          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}