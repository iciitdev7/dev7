'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Play, RotateCcw, Brain } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const callScenarios = [
  {
    id: 1,
    title: "Cold Outreach Call",
    context: "Calling a potential client who doesn't know you",
    objective: "Introduce yourself and secure a 15-minute discovery meeting",
    challenges: ["Unknown reception", "Potential gatekeepers", "Time pressure"],
    script: "Hi [Name], this is [Your Name] from [Company]. I know you weren't expecting my call, but I have a quick question that might be relevant to your [department/role]..."
  },
  {
    id: 2,
    title: "Follow-up After Demo",
    context: "Following up with a prospect after a product demonstration",
    objective: "Address any concerns and move toward a proposal discussion",
    challenges: ["Potential objections", "Decision timeline pressure", "Multiple stakeholders"],
    script: "Hi [Name], thanks for taking the time for our demo last week. I wanted to follow up on the questions you had about [specific feature/concern]..."
  },
  {
    id: 3,
    title: "Pricing Discussion Call",
    context: "Discussing pricing with a qualified prospect",
    objective: "Present pricing options and handle budget concerns",
    challenges: ["Price sensitivity", "Comparison shopping", "Budget constraints"],
    script: "Hi [Name], I've put together the pricing options we discussed. Before I walk through them, can you remind me what success looks like for your team..."
  }
];

export default function MicroExposureDrill({ drill, onComplete, onCancel }) {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [currentRehearsal, setCurrentRehearsal] = useState(0);
  const [rehearsalScript, setRehearsalScript] = useState('');
  const [completedRehearsals, setCompletedRehearsals] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [anxietyLevel, setAnxietyLevel] = useState(5);

  const scenario = callScenarios[selectedScenario];

  const handleRehearsalComplete = () => {
    if (!rehearsalScript.trim()) return;

    const newRehearsal = {
      rehearsalNumber: currentRehearsal + 1,
      script: rehearsalScript,
      anxietyLevel,
      timestamp: Date.now()
    };

    setCompletedRehearsals(prev => [...prev, newRehearsal]);
    
    if (currentRehearsal < 2) {
      setCurrentRehearsal(currentRehearsal + 1);
      setRehearsalScript('');
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
    setTimeout(() => {
      onComplete(drill.id, {
        type: 'micro-exposure',
        scenario: scenario.title,
        rehearsalsCompleted: completedRehearsals.length,
        finalAnxietyLevel: anxietyLevel,
        averageAnxiety: completedRehearsals.reduce((sum, r) => sum + r.anxietyLevel, 0) / completedRehearsals.length,
        completionTime: new Date().toISOString()
      });
    }, 2000);
  };

  const handleReset = () => {
    setCurrentRehearsal(0);
    setRehearsalScript('');
    setCompletedRehearsals([]);
    setAnxietyLevel(5);
  };

  if (isComplete) {
    const avgAnxiety = completedRehearsals.reduce((sum, r) => sum + r.anxietyLevel, 0) / completedRehearsals.length;
    const anxietyReduction = completedRehearsals.length > 1 ? 
      completedRehearsals[0].anxietyLevel - completedRehearsals[completedRehearsals.length - 1].anxietyLevel : 0;

    return (
      <Card className="max-w-3xl mx-auto border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Exposure Complete!</h2>
          <p className="text-gray-600 mb-4">
            You've successfully completed three mental rehearsals. This imaginal exposure helps reduce call anxiety and builds confidence.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-[#6495ED]">{completedRehearsals.length}</p>
              <p className="text-sm text-gray-600">Rehearsals</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600">{Math.round(avgAnxiety * 10) / 10}</p>
              <p className="text-sm text-gray-600">Avg Anxiety</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-purple-600">
                {anxietyReduction > 0 ? '-' : ''}{Math.abs(anxietyReduction)}
              </p>
              <p className="text-sm text-gray-600">Anxiety Change</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> Regular mental rehearsal reduces anticipatory anxiety and improves actual call performance. Practice this before challenging calls.
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
                  <span className="text-2xl">🧘‍♂️</span>
                  <span>Micro-Exposure</span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Rehearsal {currentRehearsal + 1} of 3 - Imaginal Exposure Therapy
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-800">
                {scenario.title}
              </Badge>
              <Button variant="outline" onClick={handleReset} size="sm">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scenario Selection & Info */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="text-lg">Call Scenario</CardTitle>
            <p className="text-sm text-gray-600">Choose your scenario and mentally rehearse the opening</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Scenario Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Scenario:</label>
                <div className="grid gap-2">
                  {callScenarios.map((s, index) => (
                    <Button
                      key={s.id}
                      variant={selectedScenario === index ? "default" : "outline"}
                      onClick={() => setSelectedScenario(index)}
                      className={`justify-start text-left h-auto p-3 ${
                        selectedScenario === index 
                          ? 'bg-gradient-to-r from-[#6495ED] to-blue-600 text-white' 
                          : 'hover:bg-blue-50'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{s.title}</div>
                        <div className="text-xs opacity-80">{s.context}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Scenario Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Objective:</h4>
                <p className="text-sm text-gray-700 mb-3">{scenario.objective}</p>
                
                <h4 className="font-medium text-gray-900 mb-2">Potential Challenges:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {scenario.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sample Script */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Sample Opening:</h4>
                <p className="text-sm text-blue-800 italic">"{scenario.script}"</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rehearsal Area */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>Mental Rehearsal #{currentRehearsal + 1}</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Visualize and script the first 20 seconds of your call
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Anxiety Level */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Current Anxiety Level (1-10):
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-green-600">1 (Calm)</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={anxietyLevel}
                    onChange={(e) => setAnxietyLevel(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-red-600">10 (Very Anxious)</span>
                </div>
                <div className="text-center">
                  <Badge className={`${
                    anxietyLevel <= 3 ? 'bg-green-100 text-green-800' :
                    anxietyLevel <= 6 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Level {anxietyLevel}
                  </Badge>
                </div>
              </div>

              {/* Script Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Your Opening Script (first 20 seconds):
                </label>
                <Textarea
                  placeholder="Write exactly what you would say in the first 20 seconds of this call. Be specific and natural..."
                  value={rehearsalScript}
                  onChange={(e) => setRehearsalScript(e.target.value)}
                  className="min-h-[120px]"
                  autoFocus
                />
                <div className="text-xs text-gray-500">
                  {rehearsalScript.length}/50 characters minimum
                </div>
              </div>

              {/* Instructions */}
              <Alert className="border-purple-200 bg-purple-50">
                <AlertDescription className="text-purple-800">
                  <strong>Visualization Instructions:</strong> Close your eyes and imagine making this call. 
                  Picture the environment, hear your voice, and feel your confidence growing with each rehearsal.
                </AlertDescription>
              </Alert>

              {/* Action Button */}
              <Button
                onClick={handleRehearsalComplete}
                disabled={rehearsalScript.length < 50}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
                size="lg"
              >
                <Play className="h-4 w-4 mr-2" />
                {currentRehearsal < 2 ? 'Complete Rehearsal & Continue' : 'Complete Final Rehearsal'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Indicator */}
      {completedRehearsals.length > 0 && (
        <Card className="mt-6 border-0 shadow-lg bg-purple-50">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Completed Rehearsals:</h3>
            <div className="space-y-2">
              {completedRehearsals.map((rehearsal, index) => (
                <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-purple-100 text-purple-800">
                      #{rehearsal.rehearsalNumber}
                    </Badge>
                    <span className="text-sm text-gray-700">
                      {rehearsal.script.substring(0, 50)}...
                    </span>
                  </div>
                  <Badge className={`${
                    rehearsal.anxietyLevel <= 3 ? 'bg-green-100 text-green-800' :
                    rehearsal.anxietyLevel <= 6 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Anxiety: {rehearsal.anxietyLevel}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}