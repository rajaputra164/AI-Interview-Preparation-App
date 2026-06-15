import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center p-6 text-white">
      <div className="card max-w-xl space-y-4 text-center">
        <div className="section-title">404</div>
        <h1 className="text-4xl font-semibold">Page not found</h1>
        <p className="text-slate-300">The page you requested does not exist in the interview workspace.</p>
        <Link className="button-primary" to="/app">Go to dashboard</Link>
      </div>
    </div>
  );
}