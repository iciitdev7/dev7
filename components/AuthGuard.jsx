'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingScreen from './LoadingScreen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Lock } from 'lucide-react';

export default function AuthGuard({ children, requireAuth = true }) {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  if (loading) {
    return <LoadingScreen />;
  }

  if (requireAuth && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-[#6495ED]/10 flex items-center justify-center">
        <Card className="max-w-md mx-4 border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#6495ED] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">{t('auth.authRequired')}</CardTitle>
            <CardDescription>
              {t('auth.authRequiredDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/auth')}
                className="w-full bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white"
              >
                {t('auth.signIn')}
              </Button>
              <Button 
                onClick={() => router.push('/')}
                variant="outline"
                className="w-full"
              >
                {t('home')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!requireAuth && user) {
    // User is authenticated but accessing a public page (like auth page)
    // Redirect to dashboard
    router.push('/dashboard');
    return <LoadingScreen />;
  }

  return children;
}