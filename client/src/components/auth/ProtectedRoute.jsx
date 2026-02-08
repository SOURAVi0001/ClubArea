import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { ROUTES, ROLES } from '@/utils/constants';

/**
 * Wraps routes that require login. Redirects to login_type (same as backend res.redirect('/login')).
 * Optional allowedRoles restricts to leader or member only.
 */
export function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const role = useAuthStore((s) => s.role);

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN_TYPE} state={{ from: location }} replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.LOGIN_TYPE} state={{ from: location, error: 'Access denied' }} replace />;
  }

  return children;
}

/** Leader-only: redirect to login if not leader */
export function LeaderRoute({ children }) {
  return <ProtectedRoute allowedRoles={[ROLES.LEADER]}>{children}</ProtectedRoute>;
}

/** Member-only: redirect to login if not member */
export function MemberRoute({ children }) {
  return <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>{children}</ProtectedRoute>;
}
