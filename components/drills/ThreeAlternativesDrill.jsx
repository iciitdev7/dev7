'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Lightbulb, Target, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const pricingObjections = [
  {
    id: 1,
    title: "Budget Constraints",
    objection: "Your solution is too expensive. We don't have that kind of budget right now.",
    context: "Mid-size company, Q4 budget discussions, competing priorities",
    hints: [
      "Focus on ROI and value demonstration",
      "Explore payment terms and phasing options",
      "Understand the cost of not solving the problem"
    ]
  },
  {
    id: 2,
    title: "Comparison Shopping",
    objection: "Your competitor is offering the same thing for 30% less. Why should we pay more?",
    context: "Procurement-driven decision, multiple vendors in consideration",
    hints: [
      "Differentiate on unique value propositions",
      "Question the true comparability of solutions",
      "Focus on total cost of ownership, not just price"
    ]
  },
  {
    id: 3,
    title: "Timing Concerns",
    objection: "This isn't the right time for us to make this investment. Maybe next year.",
    context: "Economic uncertainty, recent organizational changes",
    hints: [
      "Explore the cost of waiting",
      "Identify urgent pain points that need addressing",
      "Offer pilot programs or phased implementations"
    ]
  },
  {
    id: 4,
    title: "Authority Issues",
    objection: "I need to get approval from my boss, and they're very cost-conscious right now.",
    context: "Decision maker has limited authority, risk-averse organization",
    hints: [
      "Help build a business case for their boss",
      "Offer to present directly to decision makers",
      "Provide risk mitigation strategies"
    ]
  }
];

export default function ThreeAlternativesDrill({ drill, onComplete, onCancel }) {
  const [currentObjection, setCurrentObjection] = useState(0);
  const [alternatives, setAlternatives] = useState(['', '', '']);
  const [isComplete, setIsComplete] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const objection = pricingObjections[currentObjection];

  const handleAlternativeChange = (index, value) => {
    const newAlternatives = [...alternatives];
    newAlternatives[index] = value;
    setAlternatives(newAlternatives);
  };

  const isFormComplete = alternatives.every(alt => alt.trim().length > 20);

  const handleNext = () => {
    if (currentObjection < pricingObjections.length - 1) {
      setCurrentObjection(currentObjection + 1);
      setAlternatives(['', '', '']);
      setShowHints(false);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
    setTimeout(() => {
      onComplete(drill.id, {
        type: 'flexible-thinking',
        objectionsHandled: currentObjection + 1,
        totalAlternatives: (currentObjection + 1) * 3,
        completionTime: new Date().toISOString()
      });
    }, 2000);
  };

  if (isComplete) {
    return (
      <Card className="max-w-3xl mx-auto border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Excellent Flexible Thinking!</h2>
          <p className="text-gray-600 mb-4">
            You've developed multiple creative approaches to common pricing objections. This cognitive flexibility will help you adapt in real sales situations.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-purple-600">{(currentObjection + 1) * 3}</p>
              <p className="text-sm text-gray-600">Alternatives Created</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-[#6495ED]">{currentObjection + 1}</p>
              <p className="text-sm text-gray-600">Scenarios Completed</p>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <strong>Pro Tip:</strong> Practice the "What Else Could Be True?" technique daily. The more alternatives you can generate, the more flexible and effective you'll become in challenging situations.
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
                  <span className="text-2xl">🎯</span>
                  <span>Three Alternatives to Objections</span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Scenario {currentObjection + 1} of {pricingObjections.length} - Flexible Thinking Exercise
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {Math.round(((currentObjection + 1) / pricingObjections.length) * 100)}%
              </div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Objection Scenario */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="text-lg">{objection.title}</CardTitle>
            <p className="text-sm text-gray-600">{objection.context}</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-medium mb-2">Client Objection:</p>
              <p className="text-red-700 italic">"{objection.objection}"</p>
            </div>

            <div className="mb-4">
              <Button
                variant="outline"
                onClick={() => setShowHints(!showHints)}
                className="flex items-center space-x-2"
              >
                <Lightbulb className="h-4 w-4" />
                <span>{showHints ? 'Hide' : 'Show'} Thinking Prompts</span>
              </Button>
            </div>

            {showHints && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Consider these angles:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {objection.hints.map((hint, index) => (
                      <li key={index} className="text-sm">{hint}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Alternatives Input */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span>Your Three Alternatives</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Generate three different approaches to address this objection
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {alternatives.map((alternative, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`alternative-${index}`} className="text-base font-medium flex items-center space-x-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span>Alternative Response #{index + 1}</span>
                  </Label>
                  <Textarea
                    id={`alternative-${index}`}
                    placeholder={
                      index === 0 
                        ? "Focus on value and ROI..." 
                        : index === 1 
                        ? "Explore flexible terms or options..." 
                        : "Address underlying concerns..."
                    }
                    value={alternative}
                    onChange={(e) => handleAlternativeChange(index, e.target.value)}
                    className="min-h-[80px] text-base"
                  />
                  <div className="text-xs text-gray-500">
                    {alternative.length}/20 characters minimum
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-6">
              <Button
                onClick={handleNext}
                disabled={!isFormComplete}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-3"
                size="lg"
              >
                <span>
                  {currentObjection < pricingObjections.length - 1 ? 'Next Scenario' : 'Complete Exercise'}
                </span>
                {currentObjection < pricingObjections.length - 1 && <ArrowRight className="h-5 w-5" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="mt-6 border-0 shadow-lg bg-purple-50">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-2">Flexible Thinking Framework:</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <strong>What Else Could Be True?</strong> Challenge your first assumption about the objection
            </div>
            <div>
              <strong>SCAMPER Method:</strong> Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse
            </div>
            <div>
              <strong>Reframe Perspective:</strong> View the situation from the client's, company's, and market's perspective
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}