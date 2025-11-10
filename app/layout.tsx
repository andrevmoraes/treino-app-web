import { AccentColorProvider } from '@/components/accent-color-provider';
import { AdminAuthProvider } from '@/contexts/admin-auth-context';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/contexts/theme-context';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Treino App',
  description: 'Sistema de treinos com Metro UI Design System estilo Windows Phone',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Treino App',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  // Otimizações PWA
  applicationName: 'Treino App',
  keywords: ['treino', 'fitness', 'academia', 'exercícios', 'metro ui', 'windows phone'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover', // iOS safe area (notch)
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AccentColorProvider />
          <AuthProvider>
            <AdminAuthProvider>{children}</AdminAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
