'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Target, Clock, ArrowRight, Star } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageToggle from '../../components/LanguageToggle';
import UserMenu from '../../components/UserMenu';
import AuthGuard from '../../components/AuthGuard';
import LoadingScreen from '../../components/LoadingScreen';

export default function DashboardPage() {
  const router = useRouter();
  const { state } = useApp();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Show loading screen while data is being loaded
  if (!state.dataLoaded) {
    return <LoadingScreen />;
  }

  if (!state.assessmentCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-[#6495ED]/10">
        <Card className="max-w-md mx-4">
          <CardHeader className="text-center">
            <Brain className="h-12 w-12 text-[#6495ED] mx-auto mb-4" />
            <CardTitle>{t('assessment')} Required</CardTitle>
            <CardDescription>
              Please complete the {t('assessment').toLowerCase()} first to see your personalized {t('dashboard').toLowerCase()}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/assessment')}
              className="w-full bg-gradient-to-r from-[#6495ED] to-blue-600"
            >
              {t('takeAssessment')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lowestScoreSkill = state.userSkills.reduce((min, skill) => 
    skill.score < min.score ? skill : min
  );

  const averageScore = Math.round(
    state.userSkills.reduce((sum, skill) => sum + skill.score, 0) / state.userSkills.length
  );

  const completedDrillsCount = state.completedDrills.length;
  const recentCompletions = state.completedDrills.slice(-3).reverse();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-[#6495ED]/10">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-[#6495ED]" />
              <span className="text-xl font-bold text-gray-900">{t('appName')} {t('dashboard')}</span>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                <Button variant="ghost" onClick={() => router.push('/progress')}>
                  {t('progress')}
                </Button>
                <Button variant="ghost" onClick={() => router.push('/settings')}>
                  Settings
                </Button>
                <Button variant="ghost" onClick={() => router.push('/')}>
                  {t('home')}
                </Button>
              </nav>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            {t('welcomeBack', { name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User' })}
          </h1>
          <p className="text-gray-600 text-lg">
            {t('readyToBoost')}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('overallScore')}</p>
                  <p className="text-3xl font-bold text-[#6495ED]">{averageScore}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#6495ED]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('drillsCompleted')}</p>
                  <p className="text-3xl font-bold text-green-600">{completedDrillsCount}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('currentStreak')}</p>
                  <p className="text-3xl font-bold text-orange-600">5</p>
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
                  <p className="text-sm font-medium text-gray-600">{t('timeInvested')}</p>
                  <p className="text-3xl font-bold text-purple-600">2.3h</p>
                  <p className="text-xs text-gray-500 mt-1">{t('thisWeek')}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Priority Focus Area */}
        <div className="mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-[#6495ED]/5 to-blue-100/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-900 flex items-center space-x-2">
                    <Target className="h-5 w-5 text-[#6495ED]" />
                    <span>{t('priorityFocusArea')}</span>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {t('recommendedBased')}
                  </CardDescription>
                </div>
                <Badge className="bg-gradient-to-r from-[#6495ED] to-blue-600 text-white">
                  {t('recommended')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {t(getSkillNameKey(lowestScoreSkill.id)) || lowestScoreSkill.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{lowestScoreSkill.description}</p>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Current Score</span>
                        <span className="text-sm font-bold text-[#6495ED]">{lowestScoreSkill.score}/100</span>
                      </div>
                      <Progress 
                        value={lowestScoreSkill.score} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => router.push(`/skills/${lowestScoreSkill.id}`)}
                  className="bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white ml-4"
                  size="lg"
                >
                  {t('startTraining')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Skills Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('allMentalSkills')}</h2>
            <Badge variant="outline" className="text-gray-600">
              {t('skillsAvailable', { count: state.userSkills.length })}
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.userSkills.map((skill) => (
              <Card 
                key={skill.id} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 cursor-pointer group"
                onClick={() => router.push(`/skills/${skill.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="text-2xl">{skill.icon}</div>
                    <Badge 
                      variant={skill.score < 50 ? "destructive" : skill.score < 75 ? "secondary" : "default"}
                      className={skill.score < 50 ? "" : skill.score < 75 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}
                    >
                      {skill.score}/100
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-[#6495ED] transition-colors">
                    {t(getSkillNameKey(skill.id)) || skill.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-4 line-clamp-2">
                    {t(getSkillDescKey(skill.id)) || skill.description}
                  </CardDescription>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Progress</span>
                      <span className="text-sm font-bold text-gray-900">{skill.score}%</span>
                    </div>
                    <Progress 
                      value={skill.score} 
                      className="h-2"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {skill.drills.length} {t('exercises')}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#6495ED] transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {recentCompletions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{t('recentActivity')}</h2>
            <div className="space-y-3">
              {recentCompletions.map((completion, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">Completed: {completion.id}</p>
                          <p className="text-sm text-gray-600">{completion.skillId}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(completion.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
   </AuthGuard>
  );
}

// Helper functions to get translation keys
function getSkillNameKey(skillId) {
  const keyMap = {
    'emotional-resilience': 'emotionalResilience',
    'energy-focus': 'energyFocus',
    'confidence-building': 'confidenceBuilding',
    'stress-management': 'stressManagement',
    'motivation-goals': 'motivation',
    'communication-skills': 'communication',
    'time-management': 'timeManagement',
    'relationship-building': 'relationshipBuilding',
    'adaptability': 'adaptability',
    'problem-solving': 'problemSolving',
    'flexible-thinking': 'flexibleThinking',
    'empathy-active-listening': 'empathyListening',
    'anxiety-management': 'anxietyManagement',
    'handling-objections': 'handlingObjections',
    'goal-setting-motivation': 'goalSettingMotivation'
  };
  return keyMap[skillId];
}

function getSkillDescKey(skillId) {
  const keyMap = {
    'emotional-resilience': 'emotionalResilienceDesc',
    'energy-focus': 'energyFocusDesc',
    'confidence-building': 'confidenceBuildingDesc',
    'stress-management': 'stressManagementDesc',
    'motivation-goals': 'motivationDesc',
    'communication-skills': 'communicationDesc',
    'time-management': 'timeManagementDesc',
    'relationship-building': 'relationshipBuildingDesc',
    'adaptability': 'adaptabilityDesc',
    'problem-solving': 'problemSolvingDesc',
    'flexible-thinking': 'flexibleThinkingDesc',
    'empathy-active-listening': 'empathyListeningDesc',
    'anxiety-management': 'anxietyManagementDesc',
    'handling-objections': 'handlingObjectionsDesc',
    'goal-setting-motivation': 'goalSettingMotivationDesc'
  };
  return keyMap[skillId];
}