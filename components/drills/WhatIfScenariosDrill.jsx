'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Shuffle, RefreshCw, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const baseScenarios = [
  {
    id: 1,
    title: "Software Demo Presentation",
    baseContext: "You're presenting a CRM solution to a marketing team of 8 people in their conference room.",
    originalPlan: "Standard 30-minute demo covering features, benefits, and pricing with Q&A at the end.",
    whatIfChanges: [
      "What if... the decision maker joins 15 minutes late?",
      "What if... they mention they're also looking at your biggest competitor?",
      "What if... someone asks about integration with a system you've never heard of?",
      "What if... they seem more interested in one specific feature than your planned demo flow?"
    ]
  },
  {
    id: 2,
    title: "Budget Discussion Meeting",
    baseContext: "You're in a follow-up meeting to discuss pricing and implementation timeline with the CFO present.",
    originalPlan: "Present three pricing tiers, discuss ROI, and aim to close on the mid-tier option.",
    whatIfChanges: [
      "What if... they reveal their budget is 50% less than your lowest tier?",
      "What if... they want to start with a pilot program for just one department?",
      "What if... the CFO questions every line item and wants detailed justification?",
      "What if... they mention they need approval from a parent company you didn't know about?"
    ]
  },
  {
    id: 3,
    title: "Discovery Call with New Prospect",
    baseContext: "First call with a potential client who responded to your outreach about improving their sales process.",
    originalPlan: "Ask discovery questions, understand pain points, and schedule a demo if there's a fit.",
    whatIfChanges: [
      "What if... they start the call saying they're happy with their current solution?",
      "What if... they ask for pricing information before you've done any discovery?",
      "What if... they mention they've had bad experiences with companies like yours?",
      "What if... they seem distracted and mention they only have 10 minutes instead of 30?"
    ]
  }
];

export default function WhatIfScenariosDrill({ drill, onComplete, onCancel }) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [currentWhatIf, setCurrentWhatIf] = useState(0);
  const [response, setResponse] = useState('');
  const [completedResponses, setCompletedResponses] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const scenario = baseScenarios[currentScenario];
  const whatIfChange = scenario.whatIfChanges[currentWhatIf];

  const handleSubmitResponse = () => {
    if (!response.trim()) return;

    const newResponse = {
      scenarioId: scenario.id,
      whatIfIndex: currentWhatIf,
      whatIfChange,
      response: response.trim(),
      timestamp: Date.now()
    };

    setCompletedResponses(prev => [...prev, newResponse]);
    setResponse('');

    // Move to next what-if or scenario
    if (currentWhatIf < scenario.whatIfChanges.length - 1) {
      setCurrentWhatIf(currentWhatIf + 1);
    } else if (currentScenario < baseScenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setCurrentWhatIf(0);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
    setTimeout(() => {
      onComplete(drill.id, {
        type: 'what-if-scenarios',
        totalResponses: completedResponses.length + 1,
        scenariosCompleted: baseScenarios.length,
        adaptabilityScore: Math.min(100, (completedResponses.length + 1) * 8),
        completionTime: new Date().toISOString()
      });
    }, 2000);
  };

  const handleSkip = () => {
    // Move to next without saving response
    if (currentWhatIf < scenario.whatIfChanges.length - 1) {
      setCurrentWhatIf(currentWhatIf + 1);
    } else if (currentScenario < baseScenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setCurrentWhatIf(0);
    } else {
      handleComplete();
    }
    setResponse('');
  };

  const totalWhatIfs = baseScenarios.reduce((sum, s) => sum + s.whatIfChanges.length, 0);
  const currentWhatIfNumber = baseScenarios.slice(0, currentScenario).reduce((sum, s) => sum + s.whatIfChanges.length, 0) + currentWhatIf + 1;

  if (isComplete) {
    return (
      <Card className="max-w-3xl mx-auto border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Adaptability Mastered!</h2>
          <p className="text-gray-600 mb-4">
            You've practiced adapting your approach to unexpected changes. This cognitive flexibility will help you stay composed and effective when situations shift.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-[#6495ED]">{completedResponses.length + 1}</p>
              <p className="text-sm text-gray-600">Adaptations</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600">{baseScenarios.length}</p>
              <p className="text-sm text-gray-600">Scenarios</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-purple-600">{Math.min(100, (completedResponses.length + 1) * 8)}</p>
              <p className="text-sm text-gray-600">Flexibility Score</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> The best salespeople are like water - they adapt to the shape of any situation while maintaining their core purpose. Practice this flexibility daily.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <Card className="mb-6 border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onCancel} size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">🔄</span>
                  <span>What If... Scenario Cards</span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Challenge {currentWhatIfNumber} of {totalWhatIfs} - Context Adaptation Exercise
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {Math.round((currentWhatIfNumber / totalWhatIfs) * 100)}%
              </div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scenario Context */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Shuffle className="h-5 w-5 text-blue-600" />
              <span>{scenario.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Original Context:</h4>
                <p className="text-gray-700 text-sm">{scenario.baseContext}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Your Original Plan:</h4>
                <p className="text-blue-800 text-sm">{scenario.originalPlan}</p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-400 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2 flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Context Change:</span>
                </h4>
                <p className="text-orange-800 font-medium">{whatIfChange}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Area */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>How do you adapt?</span>
              <Badge className="bg-orange-100 text-orange-800">
                {currentWhatIf + 1}/{scenario.whatIfChanges.length}
              </Badge>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Describe how you would modify your approach given this new context
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Textarea
                placeholder="I would adapt by... For example, I might change my opening to acknowledge... or I could pivot the conversation to focus on..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-[150px] text-base"
                autoFocus
              />
              
              <div className="text-xs text-gray-500">
                {response.length}/50 characters minimum for submission
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleSubmitResponse}
                  disabled={response.trim().length < 50}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 text-white"
                >
                  Submit Adaptation
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="px-6"
                >
                  Skip
                </Button>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Scenario Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  {currentWhatIf + 1} of {scenario.whatIfChanges.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentWhatIf + 1) / scenario.whatIfChanges.length) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="mt-6 border-0 shadow-lg bg-blue-50">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-2">Flexible Thinking Strategies:</h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-700">
            <div>
              <strong>Acknowledge:</strong> Recognize the change and its impact
            </div>
            <div>
              <strong>Assess:</strong> Quickly evaluate new priorities and constraints
            </div>
            <div>
              <strong>Adapt:</strong> Modify your approach while keeping core objectives
            </div>
            <div>
              <strong>Advance:</strong> Move forward with confidence in your new plan
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}