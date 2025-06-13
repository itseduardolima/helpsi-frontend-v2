import { QueryProvider } from '@/src/providers/QueryProvider';
import { AuthProvider } from '@/src/hooks/useAuth';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Helpsi - Saúde Mental',
  description: 'Plataforma de saúde mental para todos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" >
      <body suppressHydrationWarning className={inter.variable}>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
} 