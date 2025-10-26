'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, Target, Calendar, Clock, Star, Brain } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockProgressData } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageToggle from '../../components/LanguageToggle';
import AuthGuard from '../../components/AuthGuard';


export default function ProgressPage() {
  const router = useRouter();
  const { state } = useApp();
  const { t } = useLanguage();

  const totalCompletedDrills = state.completedDrills.length;
  const currentStreak = mockProgressData.currentStreak;
  const weeklyGoal = mockProgressData.weeklyGoal;
  const weeklyCompleted = mockProgressData.weeklyProgress.reduce((sum, day) => sum + day.completed, 0);

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
                <span className="text-xl font-bold text-gray-900">{t('myProgress')}</span>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Overview Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('totalCompleted')}</p>
                    <p className="text-3xl font-bold text-[#6495ED]">{totalCompletedDrills + mockProgressData.totalDrillsCompleted}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('allTimeDrills')}</p>
                  </div>
                  <Target className="h-8 w-8 text-[#6495ED]" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('currentStreak')}</p>
                    <p className="text-3xl font-bold text-orange-600">{currentStreak}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('consecutiveDays')}</p>
                  </div>
                  <Star className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('weeklyGoal')}</p>
                    <p className="text-3xl font-bold text-green-600">{weeklyCompleted}/{weeklyGoal}</p>
                    <p className="text-xs text-gray-500 mt-1">{Math.round((weeklyCompleted/weeklyGoal)*100)}% complete</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('timeInvested')}</p>
                    <p className="text-3xl font-bold text-purple-600">2.3h</p>
                    <p className="text-xs text-gray-500 mt-1">{t('thisWeek')}</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Weekly Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-[#6495ED]" />
                  <span>{t('weeklyActivity')}</span>
                </CardTitle>
                <CardDescription>
                  {t('dailyDrillCompletions')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockProgressData.weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [value, 'Drills Completed']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Bar 
                      dataKey="completed" 
                      fill="url(#colorGradient)" 
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6495ED" />
                        <stop offset="100%" stopColor="#4169E1" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Skill Improvements */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <span>{t('skillImprovements')}</span>
                </CardTitle>
                <CardDescription>
                  {t('pointIncreases')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockProgressData.skillProgress} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="skill" type="category" width={80} />
                    <Tooltip 
                      formatter={(value) => [value, 'Points Gained']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Bar 
                      dataKey="improvement" 
                      fill="url(#skillGradient)"
                      radius={[0, 4, 4, 0]}
                    />
                    <defs>
                      <linearGradient id="skillGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span>{t('recentActivity')}</span>
              </CardTitle>
              <CardDescription>
                {t('latestCompleted')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProgressData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.activity}</p>
                        <p className="text-sm text-gray-600">{activity.skill}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{activity.duration}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
                
                {/* Show recent completions from app state */}
                {state.completedDrills.slice(-3).reverse().map((completion, index) => (
                  <div key={`recent-${index}`} className="flex items-center justify-between p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-[#6495ED] rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-gray-900">{completion.id}</p>
                        <p className="text-sm text-gray-600">{completion.skillId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-[#6495ED] text-white">{t('justCompleted')}</Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(completion.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}