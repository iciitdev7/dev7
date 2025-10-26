'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Target, TrendingUp, X, ChevronLeft, ChevronRight, Chrome as Home } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageToggle from '../../components/LanguageToggle';

export default function DemoPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const demoSteps = [
    {
      title: t('welcomeToDemo'),
      description: t('experienceHow'),
      component: 'welcome',
      highlight: null,
    },
    {
      title: t('initialAssessment'),
      description: t('startWithQuick'),
      component: 'assessment',
      highlight: 'assessment',
    },
    {
      title: t('personalizedDashboard'),
      description: t('yourDashboardShows'),
      component: 'dashboard',
      highlight: 'dashboard',
    },
    {
      title: t('interactiveDrills'),
      description: t('practiceWithEngaging'),
      component: 'drills',
      highlight: 'drills',
    },
    {
      title: t('progressTracking'),
      description: t('trackYourImprovement'),
      component: 'progress',
      highlight: 'progress',
    },
    {
      title: t('readyToStart'),
      description: t('signUpNowToBegin'),
      component: 'cta',
      highlight: null,
    },
  ];

  const currentStepData = demoSteps[currentStep];
  const progress = ((currentStep + 1) / demoSteps.length) * 100;

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < demoSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => Math.min(prev + 1, demoSteps.length - 1));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsPlaying(false);
    }
  };

  const handleClose = () => {
    router.push('/');
  };

  const renderStepContent = () => {
    switch (currentStepData.component) {
      case 'welcome':
        return (
          <div className="text-center py-12">
            <Brain className="h-24 w-24 text-[#6495ED] mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-[#6495ED] to-blue-600 bg-clip-text text-transparent">
              {t('appName')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {currentStepData.description}
            </p>
          </div>
        );

      case 'assessment':
        return (
          <div className="py-8">
            <Card className="max-w-2xl mx-auto shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">{t('sampleAssessmentQuestion')}</CardTitle>
                <CardDescription>{t('rateYourCurrent')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-blue-50 rounded-lg">
                  <p className="text-lg font-medium mb-4">
                    {t('howConfidentAre')}
                  </p>
                  <div className="space-y-3">
                    {[t('veryConfident'), t('confident'), t('neutral'), t('notConfident'), t('notAtAllConfident')].map((option, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-[#6495ED] transition-colors cursor-pointer">
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  {t('thisIsPreview')}
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'dashboard':
        return (
          <div className="py-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600">{t('currentStreak')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#6495ED]">7 {t('consecutiveDays')}</div>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600">{t('skillsInProgress')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#6495ED]">5</div>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600">{t('drillsCompleted')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#6495ED]">24</div>
                  </CardContent>
                </Card>
              </div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>{t('recommendedSkills')}</CardTitle>
                  <CardDescription>{t('basedOnYourAssessment')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: t('emotionalRegulation'), priority: t('highPriority'), progress: 35 },
                    { name: t('confidenceBuilding'), priority: t('highPriority'), progress: 20 },
                    { name: t('cognitiveFlexibility'), priority: t('mediumPriority'), progress: 45 },
                  ].map((skill, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant={skill.priority === t('highPriority') ? 'destructive' : 'secondary'}>
                          {skill.priority}
                        </Badge>
                      </div>
                      <Progress value={skill.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'drills':
        return (
          <div className="py-8">
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#6495ED] to-blue-600 rounded-lg flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{t('abcCardExercise')}</CardTitle>
                      <CardDescription>{t('emotionalRegulationDrill')}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <p className="font-medium mb-3">{t('scenario')}:</p>
                    <p className="text-gray-700 mb-4">
                      {t('potentialClient')}
                    </p>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium text-sm text-gray-600 mb-1">{t('activatingEvent')}</p>
                        <div className="p-3 bg-white rounded border-2 border-gray-200">
                          {t('lostMajorDeal')}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-600 mb-1">{t('beliefWhatYou')}</p>
                        <input
                          type="text"
                          placeholder={t('typeYourAutomatic')}
                          className="w-full p-3 bg-white rounded border-2 border-[#6495ED] focus:outline-none"
                          disabled
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-600 mb-1">{t('consequenceEmotional')}</p>
                        <input
                          type="text"
                          placeholder={t('howDoYouFeel')}
                          className="w-full p-3 bg-white rounded border-2 border-gray-200 focus:outline-none"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    {t('tryThisAnd')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="py-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#6495ED]" />
                    {t('skillImprovementOver')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { skill: t('emotionalRegulation'), before: 3, after: 7, change: '+133%' },
                      { skill: t('confidenceBuilding'), before: 4, after: 8, change: '+100%' },
                      { skill: t('emotionalResilience'), before: 5, after: 8, change: '+60%' },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.skill}</span>
                          <Badge className="bg-green-100 text-green-700">{item.change}</Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">{t('before')}</div>
                            <Progress value={item.before * 10} className="h-2" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">{t('after')}</div>
                            <Progress value={item.after * 10} className="h-2 bg-gray-200 [&>div]:bg-green-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>{t('weeklyActivity')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-end h-32 gap-2">
                    {[40, 60, 45, 80, 65, 90, 75].map((height, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-[#6495ED] to-blue-400 rounded-t transition-all"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-gray-500 mt-2">
                          {[t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')][idx]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="text-center py-12">
            <Brain className="h-20 w-20 text-[#6495ED] mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">{t('readyToTransform')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {t('joinAndStart')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push('/auth')}
                className="bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white px-8 py-3 text-lg"
              >
                {t('signUpFree')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/')}
                className="border-[#6495ED] text-[#6495ED] hover:bg-[#6495ED]/10 px-8 py-3 text-lg"
              >
                {t('backToHome')}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-[#6495ED]/10">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="hover:bg-gray-100"
              >
                <Home className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-[#6495ED]" />
                <span className="font-bold text-lg">{t('demoTour')}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                {t('stepOf', { current: currentStep + 1, total: demoSteps.length })}
              </span>
              <span className="text-sm text-gray-500">{currentStepData.title}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-3">{currentStepData.title}</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {currentStepData.description}
            </p>
          </div>

          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('previous')}
            </Button>

            <div className="flex gap-2">
              {demoSteps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentStep(idx);
                    setIsPlaying(false);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentStep
                      ? 'bg-[#6495ED] w-8'
                      : idx < currentStep
                        ? 'bg-[#6495ED]/50'
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < demoSteps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white gap-2"
              >
                {t('next')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => router.push('/auth')}
                className="bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white"
              >
                {t('getStarted')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
