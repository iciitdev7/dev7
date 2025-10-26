'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain } from 'lucide-react';
import { getKeycloakInstance, getKeycloakUserInfo } from '../../../lib/keycloak';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function KeycloakCallbackPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handleKeycloakCallback = async () => {
      try {
        const keycloak = getKeycloakInstance();

        if (!keycloak) {
          setStatus('error');
          setTimeout(() => router.push('/auth'), 2000);
          return;
        }

        if (keycloak.authenticated) {
          const userInfo = getKeycloakUserInfo();
          if (userInfo) {
            setStatus('success');
            setTimeout(() => router.push('/dashboard'), 1500);
          } else {
            setStatus('error');
            setTimeout(() => router.push('/auth'), 2000);
          }
        } else {
          setStatus('error');
          setTimeout(() => router.push('/auth'), 2000);
        }
      } catch (error) {
        console.error('Keycloak callback error:', error);
        setStatus('error');
        setTimeout(() => router.push('/auth'), 2000);
      }
    };

    handleKeycloakCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-[#6495ED]/10 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-[#6495ED] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Brain className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          {status === 'processing' && t('auth.processing')}
          {status === 'success' && t('auth.signInSuccess')}
          {status === 'error' && t('auth.unexpectedError')}
        </h1>

        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-[#6495ED] border-t-transparent rounded-full animate-spin" />
        </div>

        <p className="mt-6 text-gray-600">
          {status === 'processing' && 'Authenticating with Keycloak...'}
          {status === 'success' && 'Redirecting to dashboard...'}
          {status === 'error' && 'Redirecting to login...'}
        </p>
      </div>
    </div>
  );
}
