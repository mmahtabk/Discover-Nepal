import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Loader } from '../components/ui/Loader';

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loader label="Checking your session…" />;
  if (!user) return <Navigate to="/plan-trip" replace />;
  if (!user.isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}