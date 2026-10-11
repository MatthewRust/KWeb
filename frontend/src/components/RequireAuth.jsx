import { Navigate } from 'react-router';
import { useAuth } from '../auth.jsx';

// Wraps pages that only a logged-in user can see; everyone else is sent to the login page.
export default function RequireAuth({ children }) {
  const { user } = useAuth();
  if (user === undefined) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
