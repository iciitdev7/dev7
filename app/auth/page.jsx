'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Mail, Lock, User, ArrowRight, CircleAlert as AlertCircle, CircleCheck as CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageToggle from '../../components/LanguageToggle';

export default function AuthPage() {
  const router = useRouter();
  const { signUp, signIn, signInWithGoogle, signInWithKeycloak, resetPassword, isKeycloakConfigured } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState('signin'); // signin, signup, reset
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear messages when user starts typing
    if (message) setMessage(null);
  };

  const validateForm = () => {
    if (!formData.email || !formData.email.includes('@')) {
      setMessage({ type: 'error', text: t('auth.invalidEmail') });
      return false;
    }

    if (mode !== 'reset' && (!formData.password || formData.password.length < 6)) {
      setMessage({ type: 'error', text: t('auth.passwordTooShort') });
      return false;
    }

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: t('auth.passwordsDoNotMatch') });
      return false;
    }

    if (mode === 'signup' && (!formData.name || formData.name.trim().length < 2)) {
      setMessage({ type: 'error', text: t('auth.nameRequired') });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const { data, error } = await signUp(formData.email, formData.password);
        
        if (error) {
          setMessage({ type: 'error', text: getErrorMessage(error.message) });
        } else {
          setMessage({ 
            type: 'success', 
            text: t('auth.signUpSuccess')
          });
          // Redirect to dashboard after successful signup
          setTimeout(() => router.push('/dashboard'), 2000);
        }
      } else if (mode === 'signin') {
        const { data, error } = await signIn(formData.email, formData.password);
        
        if (error) {
          setMessage({ type: 'error', text: getErrorMessage(error.message) });
        } else {
          setMessage({ 
            type: 'success', 
            text: t('auth.signInSuccess')
          });
          // Redirect to dashboard after successful signin
          setTimeout(() => router.push('/dashboard'), 1000);
        }
      } else if (mode === 'reset') {
        const { data, error } = await resetPassword(formData.email);
        
        if (error) {
          setMessage({ type: 'error', text: getErrorMessage(error.message) });
        } else {
          setMessage({ 
            type: 'success', 
            text: t('auth.resetEmailSent')
          });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('auth.unexpectedError') });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await signInWithGoogle();

      if (error) {
        setMessage({ type: 'error', text: getErrorMessage(error.message) });
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('auth.unexpectedError') });
    } finally {
      setLoading(false);
    }
  };

  const handleKeycloakSignIn = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await signInWithKeycloak();

      if (error) {
        setMessage({ type: 'error', text: getErrorMessage(error.message) });
        setLoading(false);
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('auth.unexpectedError') });
      setLoading(false);
    }
  };

  const getErrorMessage = (errorMessage) => {
    // Map common Supabase errors to translated messages
    if (errorMessage.includes('Invalid login credentials')) {
      return t('auth.invalidCredentials');
    }
    if (errorMessage.includes('User already registered')) {
      return t('auth.userAlreadyExists');
    }
    if (errorMessage.includes('Email not confirmed')) {
      return t('auth.emailNotConfirmed');
    }
    return t('auth.unexpectedError');
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
    setMessage(null);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
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
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/')}>
                {t('home')}
              </Button>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#6495ED] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">
                {mode === 'signup' ? t('auth.createAccount') : 
                 mode === 'signin' ? t('auth.signInToAccount') : 
                 t('auth.resetPassword')}
              </CardTitle>
              <CardDescription>
                {mode === 'signup' ? t('auth.signUpDescription') : 
                 mode === 'signin' ? t('auth.signInDescription') : 
                 t('auth.resetPasswordDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name field for signup */}
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{t('auth.fullName')}</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t('auth.enterFullName')}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={loading}
                      className="pl-10"
                    />
                  </div>
                )}

                {/* Email field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{t('auth.email')}</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.enterEmail')}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={loading}
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>

                {/* Password field */}
                {mode !== 'reset' && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-gray-500" />
                      <span>{t('auth.password')}</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t('auth.enterPassword')}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      disabled={loading}
                      className="pl-10"
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    />
                  </div>
                )}

                {/* Confirm Password field for signup */}
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-gray-500" />
                      <span>{t('auth.confirmPassword')}</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder={t('auth.confirmPasswordPlaceholder')}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      disabled={loading}
                      className="pl-10"
                      autoComplete="new-password"
                    />
                  </div>
                )}

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
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t('auth.processing')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>
                        {mode === 'signup' ? t('auth.createAccount') : 
                         mode === 'signin' ? t('auth.signIn') : 
                         t('auth.sendResetEmail')}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Google Sign In */}
              {mode !== 'reset' && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">
                        {t('auth.orContinueWith')}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        <span>{t('auth.processing')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span>
                          {mode === 'signup' ? t('auth.signUpWithGoogle') : t('auth.signInWithGoogle')}
                        </span>
                      </div>
                    )}
                  </Button>

                  {isKeycloakConfigured && (
                    <>
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-muted-foreground">
                            {t('auth.corporateUsers')}
                          </span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleKeycloakSignIn}
                        disabled={loading}
                        className="w-full border-[#6495ED] hover:bg-[#6495ED]/10"
                        size="lg"
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            <span>{t('auth.processing')}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-[#6495ED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            <span className="text-[#6495ED] font-medium">
                              {t('auth.signInWithKeycloak')}
                            </span>
                          </div>
                        )}
                      </Button>
                    </>
                  )}
                </>
              )}

              {/* Mode Switching */}
              <div className="mt-6 text-center space-y-2">
                {mode === 'signin' && (
                  <>
                    <p className="text-sm text-gray-600">
                      {t('auth.noAccount')}{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('signup')}
                        className="text-[#6495ED] hover:underline font-medium"
                      >
                        {t('auth.signUp')}
                      </button>
                    </p>
                    <p className="text-sm text-gray-600">
                      <button
                        type="button"
                        onClick={() => switchMode('reset')}
                        className="text-[#6495ED] hover:underline font-medium"
                      >
                        {t('auth.forgotPassword')}
                      </button>
                    </p>
                  </>
                )}

                {mode === 'signup' && (
                  <p className="text-sm text-gray-600">
                    {t('auth.alreadyHaveAccount')}{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('signin')}
                      className="text-[#6495ED] hover:underline font-medium"
                    >
                      {t('auth.signIn')}
                    </button>
                  </p>
                )}

                {mode === 'reset' && (
                  <p className="text-sm text-gray-600">
                    {t('auth.rememberPassword')}{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('signin')}
                      className="text-[#6495ED] hover:underline font-medium"
                    >
                      {t('auth.backToSignIn')}
                    </button>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              {t('auth.secureAuth')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}