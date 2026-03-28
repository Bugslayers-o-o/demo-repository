import { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppShell from './components/layout/AppShell';
import Home from './pages/Home';
import Therapy from './pages/Therapy';
import Chat from './pages/Chat';
import Professionals from './pages/Professionals';
import Wellness from './pages/Wellness';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/LoginSignupPage';
import FeedPage from './pages/FeedPage';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppShellLayout() {
  return (
    <ProtectedRoute>
      <AppShell>
        <Outlet />
      </AppShell>
    </ProtectedRoute>
  );
}

const Placeholder = ({ label }: { label: string }) => (
  <div className="p-6 text-[var(--ms-text)]">{label} page coming soon.</div>
);

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/feed" replace /> : <LoginPage />} />
        <Route path="/signup" element={currentUser ? <Navigate to="/feed" replace /> : <SignupPage />} />

        <Route element={<AppShellLayout />}>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/therapy" element={<Therapy />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/professionals" element={<Professionals />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/resources" element={<Placeholder label="Resources" />} />
          <Route path="/community" element={<Placeholder label="Community" />} />
          <Route path="/profile" element={<Placeholder label="Profile" />} />
          <Route path="/explore" element={<Home />} />
          <Route path="/settings" element={<Placeholder label="Settings" />} />
        </Route>

        <Route path="/" element={currentUser ? <Navigate to="/feed" replace /> : <LoginPage />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen relative overflow-hidden text-[color:var(--color-text-primary)]">
        <div className="absolute inset-0 bg-hero-animated opacity-30" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(76,205,196,0.12), transparent 40%), radial-gradient(circle at 80% 30%, rgba(124,92,191,0.12), transparent 35%), radial-gradient(circle at 50% 80%, rgba(255,107,157,0.10), transparent 45%)',
          }}
        />
        <div className="absolute inset-0 bg-[rgba(13,15,20,0.9)] backdrop-blur-[36px]" />
        <div className="relative">
          <AppRoutes />
        </div>
      </div>
    </AuthProvider>
  );
}
