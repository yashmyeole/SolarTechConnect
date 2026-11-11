import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigation, useSearchParams } from 'react-router';
import { safeNext } from '@/lib/safeNext';
import { homePath, useAppStore, useRole } from '@/store';

export function PublicOnly() {
  const role = useRole();
  const [params] = useSearchParams();
  if (!role) return <Outlet />;
  return <Navigate to={safeNext(params.get('next')) ?? homePath(role)} replace />;
}

export function RequireRole({ roles }) {
  const role = useRole();
  const idle = useNavigation().state === 'idle';
  const { pathname, search } = useLocation();
  if (role && roles.includes(role)) return <Outlet />;
  if (!idle) return null;
  if (!role) return <Navigate to={`/signin?next=${encodeURIComponent(pathname + search)}`} replace />;
  return <Navigate to={homePath(role)} replace />;
}

export function SignOut() {
  const signOut = useAppStore((state) => state.signOut);
  useEffect(() => signOut(), [signOut]);
  return <Navigate to="/" replace />;
}
