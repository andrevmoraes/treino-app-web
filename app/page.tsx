'use client';

import { MetroLoading } from '@/components/metro-ui';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user) {
      router.push('/home');
    }
  }, [user, isLoading, router]);

  return <MetroLoading fullScreen />;
}
