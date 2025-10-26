'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, TrendingUp, Users } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import UserMenu from '../components/UserMenu';

export default function HomePage() {
  const router = useRouter();
  const { state } = useApp();
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleGetStarted = () => {
    if (!user) {
      router.push('/auth');
    } else if (state.assessmentCompleted) {
      router.push('/dashboard');
    } else {
      router.push('/assessment');
    }
  };

  const features = [
    {
      icon: Brain,
      title: t('mentalResilienceTitle'),
      description: t('mentalResilienceDesc'),
    },
    {
      icon: Target,
      title: t('personalizedSkillTitle'),
      description: t('personalizedSkillDesc'),
    },
    {
      icon: TrendingUp,
      title: t('progressTrackingTitle'),
      description: t('progressTrackingDesc'),
    },
    {
      icon: Users,
      title: t('salesSpecificTitle'),
      description: t('salesSpecificDesc'),
    },
  ];

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
              {user && state.assessmentCompleted && (
                <nav className="hidden md:flex space-x-6">
                  <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                    {t('dashboard')}
                  </Button>
                  <Button variant="ghost" onClick={() => router.push('/progress')}>
                    {t('progress')}
                  </Button>
                  <Button variant="ghost" onClick={() => router.push('/settings')}>
                    Settings
                  </Button>
                </nav>
              )}
              {user ? (
                <UserMenu />
              ) : (
                <Button variant="outline" onClick={() => router.push('/auth')}>
                  {t('auth.signIn')}
                </Button>
              )}
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-[#6495ED]/10 text-[#6495ED] hover:bg-[#6495ED]/20">
              {t('tagline')}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-[#6495ED] to-blue-600 bg-clip-text text-transparent">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t('heroDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white px-8 py-3 text-lg"
              >
                {!user ? t('auth.signUp') : state.assessmentCompleted ? t('goToDashboard') : t('takeAssessment')}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => router.push('/demo')}
                className="border-[#6495ED] text-[#6495ED] hover:bg-[#6495ED]/10 px-8 py-3 text-lg"
              >
                {t('viewDemo')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {t('everythingYouNeed')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('comprehensiveTools')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#6495ED] to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <div className="text-4xl font-bold text-[#6495ED] mb-2">10+</div>
              <div className="text-gray-600">{t('coreSkills')}</div>
            </div>
            <div className="p-8">
              <div className="text-4xl font-bold text-[#6495ED] mb-2">30+</div>
              <div className="text-gray-600">{t('interactiveDrills')}</div>
            </div>
            <div className="p-8">
              <div className="text-4xl font-bold text-[#6495ED] mb-2">5min</div>
              <div className="text-gray-600">{t('averageSession')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6 text-[#6495ED]" />
            <span className="text-xl font-bold">{t('appName')}</span>
          </div>
          <p className="text-gray-400">
            {t('footerTagline')}
          </p>
        </div>
      </footer>
    </div>
  );
}