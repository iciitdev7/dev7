'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, Target, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function WoopExerciseDrill({ drill, onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [woopData, setWoopData] = useState({
    wish: '',
    outcome: '',
    obstacle: '',
    plan: ''
  });
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    {
      key: 'wish',
      title: 'W - Wish',
      description: 'What do you want to achieve with your first call today?',
      placeholder: 'I want to... For example: "I want to have a productive conversation with a potential client and schedule a follow-up meeting."',
      icon: '🌟',
      color: 'blue'
    },
    {
      key: 'outcome',
      title: 'O - Outcome',
      description: 'What would be the best possible result if you achieve this wish?',
      placeholder: 'If I achieve this, I will... For example: "I will feel confident, build momentum for the day, and move closer to my monthly goals."',
      icon: '🎯',
      color: 'green'
    },
    {
      key: 'obstacle',
      title: 'O - Obstacle',
      description: 'What internal obstacle might prevent you from achieving this wish?',
      placeholder: 'The main obstacle might be... For example: "I might feel nervous and rush through my introduction, or I might avoid making the call altogether."',
      icon: '🚧',
      color: 'orange'
    },
    {
      key: 'plan',
      title: 'P - Plan',
      description: 'If that obstacle occurs, what will you do? Create an if-then plan.',
      placeholder: 'If [obstacle], then I will... For example: "If I feel nervous, then I will take three deep breaths and remind myself of my preparation."',
      icon: '📋',
      color: 'purple'
    }
  ];

  const currentStepData = steps[currentStep - 1];

  const handleInputChange = (value) => {
    setWoopData(prev => ({
      ...prev,
      [currentStepData.key]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
    setTimeout(() => {
      onComplete(drill.id, {
        type: 'woop-exercise',
        woopData,
        completionTime: new Date().toISOString(),
        stepsCompleted: 4
      });
    }, 2000);
  };

  const isCurrentStepComplete = () => {
    return woopData[currentStepData.key].trim().length > 20;
  };

  if (isComplete) {
    return (
      <Card className="max-w-3xl mx-auto border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">WOOP Plan Complete!</h2>
          <p className="text-gray-600 mb-6">
            You've created a comprehensive plan for your first call today. This mental contrasting technique helps bridge the gap between intention and action.
          </p>
          
          {/* WOOP Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-bold text-gray-900 mb-4 text-center">Your WOOP Plan:</h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.key} className={`bg-${step.color}-50 rounded-lg p-4`}>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{step.icon}</span>
                    <div className="flex-1">
                      <h4 className={`font-medium text-${step.color}-900 mb-1`}>{step.title}</h4>
                      <p className={`text-sm text-${step.color}-800`}>
                        {woopData[step.key]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> Keep this WOOP plan visible during your first call. Mental contrasting with implementation intentions significantly increases goal achievement rates.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
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
                  <span className="text-2xl">🎯</span>
                  <span>WOOP Exercise</span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Step {currentStep} of 4 - Plan Your First Call of the Day
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">{Math.round((currentStep / 4) * 100)}% Complete</div>
              <div className="w-24 h-2 bg-gray-200 rounded-full">
                <div 
                  className={`h-2 bg-gradient-to-r from-${currentStepData.color}-500 to-${currentStepData.color}-600 rounded-full transition-all duration-300`}
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card className="border-0 shadow-xl">
        <CardHeader className={`bg-gradient-to-r from-${currentStepData.color}-50 to-${currentStepData.color}-100`}>
          <CardTitle className="text-xl text-gray-900 flex items-center space-x-3">
            <span className="text-3xl">{currentStepData.icon}</span>
            <span>{currentStepData.title}</span>
          </CardTitle>
          <p className="text-gray-600">{currentStepData.description}</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Input Area */}
            <div className="space-y-2">
              <Label htmlFor="woop-input" className="text-base font-medium">
                Your Response
              </Label>
              <Textarea
                id="woop-input"
                placeholder={currentStepData.placeholder}
                value={woopData[currentStepData.key]}
                onChange={(e) => handleInputChange(e.target.value)}
                className="min-h-[120px] text-base"
                autoFocus
              />
              <div className="text-xs text-gray-500">
                {woopData[currentStepData.key].length}/20 characters minimum
              </div>
            </div>

            {/* Step-specific guidance */}
            <Alert className={`border-${currentStepData.color}-200 bg-${currentStepData.color}-50`}>
              <AlertDescription className={`text-${currentStepData.color}-800`}>
                {currentStep === 1 && (
                  <><strong>Tip:</strong> Be specific and realistic. Focus on what you can control in the next 2 hours.</>
                )}
                {currentStep === 2 && (
                  <><strong>Tip:</strong> Think beyond just the call outcome. How will success make you feel? What will it enable?</>
                )}
                {currentStep === 3 && (
                  <><strong>Tip:</strong> Focus on internal obstacles (emotions, thoughts, behaviors) rather than external ones.</>
                )}
                {currentStep === 4 && (
                  <><strong>Tip:</strong> Use "If-Then" format. Be specific about the action you'll take when the obstacle appears.</>
                )}
              </AlertDescription>
            </Alert>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className={`w-3 h-3 rounded-full ${
                      num === currentStep
                        ? `bg-${currentStepData.color}-500`
                        : num < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                disabled={!isCurrentStepComplete()}
                className={`flex items-center space-x-2 bg-gradient-to-r from-${currentStepData.color}-500 to-${currentStepData.color}-600 hover:from-${currentStepData.color}-600 hover:to-${currentStepData.color}-700 text-white px-6`}
              >
                <span>{currentStep === 4 ? 'Complete WOOP' : 'Next Step'}</span>
                {currentStep < 4 && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WOOP Method Info */}
      <Card className="mt-6 border-0 shadow-lg bg-blue-50">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-2">About WOOP Method:</h3>
          <p className="text-sm text-gray-700 mb-2">
            WOOP (Wish-Outcome-Obstacle-Plan) is a science-based mental strategy that helps you achieve your goals by combining positive thinking with realistic planning.
          </p>
          <div className="grid md:grid-cols-4 gap-4 text-xs text-gray-600">
            <div><strong>Wish:</strong> Identify your goal</div>
            <div><strong>Outcome:</strong> Imagine the benefits</div>
            <div><strong>Obstacle:</strong> Anticipate challenges</div>
            <div><strong>Plan:</strong> Create if-then responses</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}