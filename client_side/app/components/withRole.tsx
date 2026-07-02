// components/withRole.tsx
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function withRole(Component: React.ComponentType, allowedRoles: string[]) {
  return function ProtectedComponent(props: Record<string, unknown>) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) router.push('/login');
        else if (!allowedRoles.includes(user.role)) router.push('/error/403');
      }
    }, [user, loading, router]);

    if (loading || !user) return <div>Memuat...</div>;
    if (!allowedRoles.includes(user.role)) return null;

    return <Component {...props} />;
  };
}