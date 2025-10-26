import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import LoadingScreen from '../components/LoadingScreen';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SalesMind - Mental Wellness for Sales Teams',
  description: 'Boost your sales performance with mental wellness tools and techniques',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            <AppProvider>
              <Suspense fallback={<LoadingScreen />}>
                {children}
              </Suspense>
            </AppProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}