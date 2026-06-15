import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute() {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-white/70">Loading your interview workspace...</div>;
  }

  if (!token) {
    return <Navigate replace to="/auth" />;
  }

  return <Outlet />;
}