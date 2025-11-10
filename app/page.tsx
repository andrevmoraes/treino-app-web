'use client';

import { MetroLoading } from '@/components/metro-ui';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect baseado em autenticação
    if (user) {
      router.replace('/home');
    } else {
      router.replace('/login');
    }
  }, [user, router]);

  // Renderiza sempre o mesmo conteúdo (evita hydration mismatch)
  return <MetroLoading fullScreen />;
}
