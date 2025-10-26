'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useLanguage } from '../../../contexts/LanguageContext';
import LanguageToggle from '../../../components/LanguageToggle';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Check if we have the necessary tokens for password reset
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      setMessage({ 
        type: 'error', 
        text: t('auth.invalidResetLink')
      });
    }
  }, [searchParams, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || password.length < 6) {
      setMessage({ type: 'error', text: t('auth.passwordTooShort') });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: t('auth.passwordsDoNotMatch') });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setMessage({ type: 'error', text: t('auth.passwordUpdateFailed') });
      } else {
        setMessage({ 
          type: 'success', 
          text: t('auth.passwordUpdatedSuccess')
        });
        
        // Redirect to dashboard after successful password update
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('auth.unexpectedError') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-[#6495ED]/10">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-[#6495ED]" />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#6495ED] to-blue-600 bg-clip-text text-transparent">
                {t('appName')}
              </span>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#6495ED] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">
                {t('auth.setNewPassword')}
              </CardTitle>
              <CardDescription>
                {t('auth.setNewPasswordDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-gray-500" />
                    <span>{t('auth.newPassword')}</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('auth.enterNewPassword')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="pl-10"
                    autoComplete="new-password"
                  />
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-gray-500" />
                    <span>{t('auth.confirmNewPassword')}</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="pl-10"
                    autoComplete="new-password"
                  />
                </div>

                {/* Message Display */}
                {message && (
                  <Alert className={`${
                    message.type === 'success' 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}>
                    {message.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={
                      message.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }>
                      {message.text}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !password || !confirmPassword}
                  className="w-full bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t('auth.updating')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{t('auth.updatePassword')}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}