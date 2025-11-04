'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, PlayCircle, CheckCircle2, Brain } from 'lucide-react';
import { mockSkills } from '../../../data/mockData';
import { useApp } from '../../../contexts/AppContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import LanguageToggle from '../../../components/LanguageToggle';
import AuthGuard from '../../../components/AuthGuard';
import DrillStatsModal from '../../../components/DrillStatsModal';
import { drillHistoryService } from '../../../lib/drillHistoryService';

// Import drill components
import AbcCardDrill from '../../../components/drills/AbcCardDrill';
import BreathingTimerDrill from '../../../components/drills/BreathingTimerDrill';
import ThreeFactsDrill from '../../../components/drills/ThreeFactsDrill';
import RoleplayDialogueDrill from '../../../components/drills/RoleplayDialogueDrill';
import Summary30Drill from '../../../components/drills/Summary30Drill';
import EmotionalLabelingDrill from '../../../components/drills/EmotionalLabelingDrill';
import ThreeAlternativesDrill from '../../../components/drills/ThreeAlternativesDrill';
import WhatIfScenariosDrill from '../../../components/drills/WhatIfScenariosDrill';
import PerspectiveReframeDrill from '../../../components/drills/PerspectiveReframeDrill';
import MicroExposureDrill from '../../../components/drills/MicroExposureDrill';
import WoopExerciseDrill from '../../../components/drills/WoopExerciseDrill';
import OneOutcomeThreeActionsDrill from '../../../components/drills/OneOutcomeThreeActionsDrill';
import SixtySecondRetroDrill from '../../../components/drills/SixtySecondRetroDrill';
import DefaultDrill from '../../../components/drills/DefaultDrill';

// Drill component mapping
const drillComponents = {
  AbcCardDrill,
  BreathingTimerDrill, 
  ThreeFactsDrill,
  RoleplayDialogueDrill,
  Summary30Drill,
  EmotionalLabelingDrill,
  ThreeAlternativesDrill,
  WhatIfScenariosDrill,
  PerspectiveReframeDrill,
  MicroExposureDrill,
  WoopExerciseDrill,
  OneOutcomeThreeActionsDrill,
  SixtySecondRetroDrill,
  DefaultDrill
};

export default function SkillPage({ params }) {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { t } = useLanguage();
  const [activeDrill, setActiveDrill] = useState(null);
  const [completedDrills, setCompletedDrills] = useState(new Set());
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [statsData, setStatsData] = useState({ drillId: null, drillName: '', history: [] });

  const skill = mockSkills.find(s => s.id === params.skillId);
  
  if (!skill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-2">{t('skills')} Not Found</h2>
            <p className="text-gray-600 mb-4">The requested skill could not be found.</p>
            <Button onClick={() => router.push('/dashboard')}>
              {t('back')} to {t('dashboard')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDrillComplete = async (drillId, data = {}) => {
    // Update local state
    setCompletedDrills(prev => new Set([...prev, drillId]));
    setActiveDrill(null);

    // Update global state
    dispatch({
      type: 'COMPLETE_DRILL',
      payload: {
        drillId,
        skillId: skill.id,
        data
      }
    });

    // Show stats modal if requested
    if (data.showStats) {
      const drill = skill.drills.find(d => d.id === drillId);
      const userId = state.user?.id || 'demo-user';

      // Fetch drill history
      const history = await drillHistoryService.getDrillHistory(userId, drillId, 10);

      setStatsData({
        drillId: drillId,
        drillName: drill?.name || 'Drill',
        history: history
      });
      setShowStatsModal(true);
    }
  };

  const isDrillCompleted = (drillId) => {
    return completedDrills.has(drillId) || 
           state.completedDrills.some(completion => completion.id === drillId);
  };

  const renderDrill = (drill) => {
    const DrillComponent = drillComponents[drill.component] || drillComponents.DefaultDrill;
    return (
      <DrillComponent 
        drill={drill} 
        onComplete={handleDrillComplete}
        onCancel={() => setActiveDrill(null)}
      />
    );
  };

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
                <span className="text-xl font-bold text-gray-900">{t(getSkillNameKey(skill.id)) || skill.name}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-[#6495ED] to-blue-600 text-white">
                {t('score')}: {skill.score}/100
              </Badge>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeDrill ? (
          // Active Drill View
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setActiveDrill(null)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t('back')} to {t('skills')}</span>
              </Button>
            </div>
            {renderDrill(activeDrill)}
          </div>
        ) : (
          // Skill Overview
          <>
            {/* Skill Header */}
            <div className="max-w-4xl mx-auto mb-8">
              <Card className="border-0 shadow-xl bg-gradient-to-r from-[#6495ED]/5 to-blue-100/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="text-3xl">{skill.icon}</div>
                        <div>
                          <CardTitle className="text-2xl text-gray-900">
                            {t(getSkillNameKey(skill.id)) || skill.name}
                          </CardTitle>
                          <CardDescription className="text-lg mt-1">
                            {t(getSkillDescKey(skill.id)) || skill.description}
                          </CardDescription>
                        </div>
                      </div>
                      
                      {/* Progress */}
                      <div className="mb-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">{t('currentProgress')}</span>
                          <span className="text-sm font-bold text-[#6495ED]">{skill.score}/100</span>
                        </div>
                        <Progress value={skill.score} className="h-3" />
                      </div>

                      {/* Methodologies */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-2">{t('basedOn')}</h3>
                        <div className="flex flex-wrap gap-2">
                          {skill.methodologies.map((methodology, index) => (
                            <Badge key={index} variant="outline" className="bg-white/80">
                              {methodology}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Drills Section */}
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{t('trainingExercises')}</h2>
                <Badge variant="outline" className="text-gray-600">
                  {t('exercisesAvailable', { count: skill.drills.length })}
                </Badge>
              </div>

              <div className="grid gap-6">
                {skill.drills.map((drill) => (
                  <Card 
                    key={drill.id} 
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{t(getDrillNameKey(drill.id)) || drill.title}</h3>
                            {isDrillCompleted(drill.id) && (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-4">{t(getDrillDescKey(drill.id)) || drill.description}</p>
                          
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>{drill.duration || '5-10 ' + t('minutes')}</span>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {drill.type}
                            </Badge>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => setActiveDrill(drill)}
                          className={`ml-4 ${
                            isDrillCompleted(drill.id)
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED]'
                          } text-white px-6`}
                          size="lg"
                        >
                          {isDrillCompleted(drill.id) ? t('completed') : t('startExercise')}
                          <PlayCircle className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Stats Modal */}
      {showStatsModal && (
        <DrillStatsModal
          drillId={statsData.drillId}
          drillName={statsData.drillName}
          completionHistory={statsData.history}
          onClose={() => setShowStatsModal(false)}
        />
      )}
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

function getDrillNameKey(drillId) {
  const keyMap = {
    'abc-card': 'abcCardAnalysis',
    '90-sec-reset': 'ninetySecondReset',
    '3-kind-facts': 'threeKindFacts',
    'roleplay-dialogue': 'roleplayDialogue',
    'summary-30': 'summary30',
    'emotional-labeling': 'emotionalLabeling',
    'three-alternatives': 'threeAlternatives',
    'what-if-scenarios': 'whatIfScenarios',
    'perspective-reframe': 'perspectiveReframe',
    'micro-exposure': 'microExposure',
    'woop-exercise': 'woopExercise',
    'five-fast-cards': 'fiveFastCards',
    'next-steps-experiment': 'nextStepsExperiment',
    'one-outcome-three-actions': 'oneOutcomeThreeActions',
    'sixty-second-mini-retro': 'sixtySecondMiniRetro',
    'energy-audit': 'energyAudit',
    'focus-timer': 'focusTimer',
    'mindful-transition': 'mindfulTransition',
    'success-inventory': 'successInventory',
    'power-pose': 'powerPose',
    'positive-affirmations': 'positiveAffirmations',
    'stress-thermometer': 'stressThermometer',
    'box-breathing': 'boxBreathing',
    'worry-time': 'worryTime',
    'smart-goals': 'smartGoals',
    'motivation-check': 'motivationCheck',
    'vision-board': 'visionBoard',
    'active-listening': 'activeListening',
    'elevator-pitch': 'elevatorPitch',
    'empathy-mapping': 'empathyMapping',
    'time-audit': 'timeAudit',
    'priority-matrix': 'priorityMatrix',
    'pomodoro-session': 'pomodoroSession',
    'relationship-map': 'relationshipMap',
    'gratitude-messages': 'gratitudeMessages',
    'follow-up-tracker': 'followUpTracker',
    'change-readiness': 'changeReadiness',
    'flexibility-challenge': 'flexibilityChallenge',
    'scenario-planning': 'scenarioPlanning',
    'problem-definition': 'problemDefinition',
    'creative-alternatives': 'creativeAlternatives',
    'solution-testing': 'solutionTesting'
  };
  return keyMap[drillId];
}

function getDrillDescKey(drillId) {
  const keyMap = {
    'abc-card': 'abcCardDesc',
    '90-sec-reset': 'ninetySecondResetDesc',
    '3-kind-facts': 'threeKindFactsDesc',
    'roleplay-dialogue': 'roleplayDialogueDesc',
    'summary-30': 'summary30Desc',
    'emotional-labeling': 'emotionalLabelingDesc',
    'three-alternatives': 'threeAlternativesDesc',
    'what-if-scenarios': 'whatIfScenariosDesc',
    'perspective-reframe': 'perspectiveReframeDesc',
    'micro-exposure': 'microExposureDesc',
    'woop-exercise': 'woopExerciseDesc',
    'five-fast-cards': 'fiveFastCardsDesc',
    'next-steps-experiment': 'nextStepsExperimentDesc',
    'one-outcome-three-actions': 'oneOutcomeThreeActionsDesc',
    'sixty-second-mini-retro': 'sixtySecondMiniRetroDesc',
    'energy-audit': 'energyAuditDesc',
    'focus-timer': 'focusTimerDesc',
    'mindful-transition': 'mindfulTransitionDesc',
    'success-inventory': 'successInventoryDesc',
    'power-pose': 'powerPoseDesc',
    'positive-affirmations': 'positiveAffirmationsDesc',
    'stress-thermometer': 'stressThermometerDesc',
    'box-breathing': 'boxBreathingDesc',
    'worry-time': 'worryTimeDesc',
    'smart-goals': 'smartGoalsDesc',
    'motivation-check': 'motivationCheckDesc',
    'vision-board': 'visionBoardDesc',
    'active-listening': 'activeListeningDesc',
    'elevator-pitch': 'elevatorPitchDesc',
    'empathy-mapping': 'empathyMappingDesc',
    'time-audit': 'timeAuditDesc',
    'priority-matrix': 'priorityMatrixDesc',
    'pomodoro-session': 'pomodoroSessionDesc',
    'relationship-map': 'relationshipMapDesc',
    'gratitude-messages': 'gratitudeMessagesDesc',
    'follow-up-tracker': 'followUpTrackerDesc',
    'change-readiness': 'changeReadinessDesc',
    'flexibility-challenge': 'flexibilityChallengeDesc',
    'scenario-planning': 'scenarioPlanningDesc',
    'problem-definition': 'problemDefinitionDesc',
    'creative-alternatives': 'creativeAlternativesDesc',
    'solution-testing': 'solutionTestingDesc'
  };
  return keyMap[drillId];
}