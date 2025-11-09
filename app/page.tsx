'use client';

import { MetroLoading } from '@/components/metro-ui';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      router.push('/home');
    }
  }, [user, router]);

  return <MetroLoading fullScreen />;
}
