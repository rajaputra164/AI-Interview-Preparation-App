import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { InterviewPage } from '@/pages/InterviewPage';
import { ResumePage } from '@/pages/ResumePage';
import { CodingPage } from '@/pages/CodingPage';
import { CareerPage } from '@/pages/CareerPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AdminPage } from '@/pages/AdminPage';

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/app" element={<DashboardPage />} />
          <Route path="/app/interviews" element={<InterviewPage />} />
          <Route path="/app/resume" element={<ResumePage />} />
          <Route path="/app/coding" element={<CodingPage />} />
          <Route path="/app/career" element={<CareerPage />} />
          <Route path="/app/profile" element={<ProfilePage />} />
          <Route path="/app/admin" element={<AdminPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate replace to="/app" />} />
    </Routes>
  );
}