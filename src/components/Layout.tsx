'use client';

import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function Layout({ children, requireAuth = true }: LayoutProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('@Helpsi:token');
    
    if (requireAuth && (!user || !token)) {
      router.push('/login');
    }
  }, [requireAuth, user, router]);

  return <>{children}</>;
} 