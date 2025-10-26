'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Settings, Brain } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageToggle from '../../components/LanguageToggle';
import DataManager from '../../components/DataManager';
import AuthGuard from '../../components/AuthGuard';


export default function SettingsPage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
   <AuthGuard>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-[#6495ED]/10">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t('dashboard')}</span>
              </Button>
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-[#6495ED]" />
                <span className="text-xl font-bold text-gray-900">{t('settings')}</span>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              {t('appSettings')}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('manageDataPreferences')}
            </p>
          </div>

          {/* Language Settings */}
          <Card className="border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-[#6495ED]" />
                <span>{t('languagePreferences')}</span>
              </CardTitle>
              <CardDescription>
                {t('customizeExperience')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{t('interfaceLanguage')}</h3>
                  <p className="text-sm text-gray-600">{t('choosePreferredLanguage')}</p>
                </div>
                <LanguageToggle />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-[#6495ED]" />
                <span>{t('dataManagement')}</span>
              </CardTitle>
              <CardDescription>
                {t('backupRestoreClear')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataManager />
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </AuthGuard>
  );
}