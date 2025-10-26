'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Eye, Users, Building, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const reframingScenarios = [
  {
    id: 1,
    title: "Delayed Decision Making",
    situation: "A prospect has been evaluating your solution for 3 months and keeps asking for more information and additional meetings, but hasn't moved toward a decision.",
    initialFrame: "The prospect is wasting my time and probably isn't serious about buying.",
    perspectives: [
      {
        name: "Client's Perspective",
        icon: Users,
        color: "blue",
        prompts: [
          "What pressures might they be facing internally?",
          "What risks are they trying to mitigate?",
          "What would make this decision easier for them?"
        ]
      },
      {
        name: "Company's Perspective", 
        icon: Building,
        color: "green",
        prompts: [
          "How does their decision process reflect their company culture?",
          "What organizational changes might be affecting their timeline?",
          "What would success look like from their company's viewpoint?"
        ]
      },
      {
        name: "Market Perspective",
        icon: TrendingUp,
        color: "purple",
        prompts: [
          "How might industry trends be influencing their caution?",
          "What competitive pressures might they be considering?",
          "How does the economic climate affect their decision-making?"
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Price Objection",
    situation: "A qualified prospect says your solution is too expensive and they can get something similar for half the price from a competitor.",
    initialFrame: "They don't understand the value and are just focused on the cheapest option.",
    perspectives: [
      {
        name: "Client's Perspective",
        icon: Users,
        color: "blue", 
        prompts: [
          "What budget constraints might they be operating under?",
          "How might they be measured or evaluated on cost savings?",
          "What past experiences might influence their price sensitivity?"
        ]
      },
      {
        name: "Company's Perspective",
        icon: Building,
        color: "green",
        prompts: [
          "How might their procurement process influence price focus?",
          "What financial pressures might the company be facing?",
          "How do they typically evaluate ROI and value?"
        ]
      },
      {
        name: "Market Perspective",
        icon: TrendingUp,
        color: "purple",
        prompts: [
          "How has pricing competition evolved in their industry?",
          "What market conditions might be driving cost consciousness?",
          "How do similar companies typically approach these investments?"
        ]
      }
    ]
  }
];

export default function PerspectiveReframeDrill({ drill, onComplete, onCancel }) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [currentPerspective, setCurrentPerspective] = useState(0);
  const [reframes, setReframes] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  const scenario = reframingScenarios[currentScenario];
  const perspective = scenario.perspectives[currentPerspective];

  const handleReframeChange = (value) => {
    const key = `${currentScenario}-${currentPerspective}`;
    setReframes(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getCurrentReframe = () => {
    const key = `${currentScenario}-${currentPerspective}`;
    return reframes[key] || '';
  };

  const handleNext = () => {
    if (currentPerspective < scenario.perspectives.length - 1) {
      setCurrentPerspective(currentPerspective + 1);
    } else if (currentScenario < reframingScenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setCurrentPerspective(0);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentPerspective > 0) {
      setCurrentPerspective(currentPerspective - 1);
    } else if (currentScenario > 0) {
      setCurrentScenario(currentScenario - 1);
      setCurrentPerspective(reframingScenarios[currentScenario - 1].perspectives.length - 1);
    }
  };

  const handleComplete = () => {
    const totalReframes = Object.keys(reframes).length;
    const completedReframes = Object.values(reframes).filter(r => r.trim().length > 30).length;
    
    setIsComplete(true);
    setTimeout(() => {
      onComplete(drill.id, {
        type: 'perspective-reframe',
        totalReframes: completedReframes,
        scenariosCompleted: reframingScenarios.length,
        perspectivesExplored: totalReframes,
        completionTime: new Date().toISOString()
      });
    }, 2000);
  };

  const isCurrentComplete = getCurrentReframe().trim().length > 30;
  const totalSteps = reframingScenarios.reduce((sum, s) => sum + s.perspectives.length, 0);
  const currentStep = reframingScenarios.slice(0, currentScenario).reduce((sum, s) => sum + s.perspectives.length, 0) + currentPerspective + 1;

  if (isComplete) {
    const completedReframes = Object.values(reframes).filter(r => r.trim().length > 30).length;
    
    return (
      <Card className="max-w-3xl mx-auto border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Perspective Mastery Achieved!</h2>
          <p className="text-gray-600 mb-4">
            You've practiced reframing challenging situations from multiple viewpoints. This cognitive flexibility will help you find creative solutions and build stronger relationships.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-indigo-600">{completedReframes}</p>
              <p className="text-sm text-gray-600">Reframes Created</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-[#6495ED]">{reframingScenarios.length}</p>
              <p className="text-sm text-gray-600">Scenarios</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600">3</p>
              <p className="text-sm text-gray-600">Perspectives Each</p>
            </div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4">
            <p className="text-sm text-indigo-800">
              <strong>Pro Tip:</strong> When facing challenges, always ask "What else could be true?" and explore at least three different perspectives before deciding on your approach.
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
                  <span className="text-2xl">👁️</span>
                  <span>Perspective Reframing</span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Step {currentStep} of {totalSteps} - Challenge Rigid Thinking Patterns
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-indigo-600">
                {Math.round((currentStep / totalSteps) * 100)}%
              </div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scenario & Current Perspective */}
        <Card className="border-0 shadow-lg">
          <CardHeader className={`bg-gradient-to-r from-${perspective.color}-50 to-indigo-50`}>
            <CardTitle className="text-lg flex items-center space-x-2">
              <perspective.icon className={`h-5 w-5 text-${perspective.color}-600`} />
              <span>{perspective.name}</span>
            </CardTitle>
            <Badge className={`bg-${perspective.color}-100 text-${perspective.color}-800 w-fit`}>
              Scenario: {scenario.title}
            </Badge>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Situation:</h4>
                <p className="text-gray-700 text-sm">{scenario.situation}</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Initial (Rigid) Frame:</h4>
                <p className="text-red-800 text-sm italic">"{scenario.initialFrame}"</p>
              </div>

              <div className={`bg-${perspective.color}-50 rounded-lg p-4`}>
                <h4 className={`font-medium text-${perspective.color}-900 mb-3`}>Consider from {perspective.name}:</h4>
                <ul className="space-y-2">
                  {perspective.prompts.map((prompt, index) => (
                    <li key={index} className={`text-${perspective.color}-800 text-sm flex items-start space-x-2`}>
                      <span className="text-xs mt-1">•</span>
                      <span>{prompt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reframe Input */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-indigo-600" />
              <span>Your Reframe</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              How might this situation look different from the {perspective.name.toLowerCase()}?
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Textarea
                placeholder={`From the ${perspective.name.toLowerCase()}, this situation might actually be... Perhaps they are... It's possible that...`}
                value={getCurrentReframe()}
                onChange={(e) => handleReframeChange(e.target.value)}
                className="min-h-[150px] text-base"
                autoFocus
              />
              
              <div className="text-xs text-gray-500">
                {getCurrentReframe().length}/30 characters minimum
              </div>

              <Alert className={`border-${perspective.color}-200 bg-${perspective.color}-50`}>
                <AlertDescription className={`text-${perspective.color}-800`}>
                  <strong>Reframing Tip:</strong> Start with "What if..." or "Perhaps..." to open your mind to alternative explanations. Look for positive intent behind challenging behaviors.
                </AlertDescription>
              </Alert>

              <div className="flex space-x-3">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  disabled={currentScenario === 0 && currentPerspective === 0}
                  className="px-6"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentComplete}
                  className={`flex-1 bg-gradient-to-r from-${perspective.color}-500 to-indigo-600 hover:from-${perspective.color}-600 hover:to-indigo-700 text-white`}
                >
                  {currentStep === totalSteps ? 'Complete Exercise' : 'Next Perspective'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Indicator */}
      <Card className="mt-6 border-0 shadow-lg bg-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">Perspective Progress</h3>
            <span className="text-sm text-gray-600">{currentStep} of {totalSteps} perspectives explored</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            {scenario.perspectives.map((p, index) => (
              <div key={index} className={`p-2 rounded-lg ${index === currentPerspective ? `bg-${p.color}-100` : 'bg-gray-100'}`}>
                <p.icon className={`h-4 w-4 mx-auto mb-1 ${index === currentPerspective ? `text-${p.color}-600` : 'text-gray-400'}`} />
                <p className={`text-xs ${index === currentPerspective ? `text-${p.color}-800` : 'text-gray-600'}`}>
                  {p.name}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}