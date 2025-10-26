'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, Heart, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ThreeFactsDrill({ drill, onComplete, onCancel }) {
  const [facts, setFacts] = useState(['', '', '']);
  const [isComplete, setIsComplete] = useState(false);

  const handleFactChange = (index, value) => {
    const newFacts = [...facts];
    newFacts[index] = value;
    setFacts(newFacts);
  };

  const isFormComplete = facts.every(fact => fact.trim().length > 0);

  const handleComplete = () => {
    if (!isFormComplete) return;
    
    setIsComplete(true);
    setTimeout(() => {
      onComplete(drill.id, {
        type: 'self-compassion',
        facts: facts.filter(fact => fact.trim().length > 0),
        completionTime: new Date().toISOString()
      });
    }, 2000);
  };

  if (isComplete) {
    return (
      <Card className="max-w-2xl mx-auto border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-pink-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Beautiful Work!</h2>
          <p className="text-gray-600 mb-4">
            You've practiced self-compassion by acknowledging your positive qualities. This helps build resilience and emotional strength.
          </p>
          <div className="bg-pink-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-pink-900 mb-2">Your Three Kind Facts:</h3>
            <ul className="space-y-1 text-sm text-pink-800">
              {facts.map((fact, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-pink-600 mt-0.5">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> Return to these facts when facing challenges. Self-compassion is a powerful tool for maintaining confidence and resilience in sales.
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
                  <span className="text-2xl">💝</span>
                  <span>Three Kind Facts</span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Self-Compassion Exercise for Building Resilience
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card className="border-0 shadow-xl mb-6">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
          <CardTitle className="text-xl text-gray-900">
            List Three Kind Facts About Yourself
          </CardTitle>
          <p className="text-gray-600">
            Think of three positive, true statements about yourself. These should be facts, not opinions - things you know to be true about your character, abilities, or efforts.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Instructions */}
            <Alert className="border-blue-200 bg-blue-50">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Focus on facts about your efforts, growth, relationships, or positive impact. For example: "I always listen carefully to my clients" or "I've improved my presentation skills this year."
              </AlertDescription>
            </Alert>

            {/* Input Fields */}
            <div className="space-y-6">
              {facts.map((fact, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`fact-${index}`} className="text-base font-medium flex items-center space-x-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span>Kind Fact #{index + 1}</span>
                  </Label>
                  <Input
                    id={`fact-${index}`}
                    placeholder={
                      index === 0 
                        ? "I am someone who..." 
                        : index === 1 
                        ? "I have the ability to..." 
                        : "I consistently..."
                    }
                    value={fact}
                    onChange={(e) => handleFactChange(index, e.target.value)}
                    className="text-base py-3"
                  />
                </div>
              ))}
            </div>

            {/* Examples */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Example Kind Facts:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• I genuinely care about helping my clients find solutions</li>
                <li>• I bounce back from setbacks and keep trying</li>
                <li>• I've built meaningful relationships with my colleagues</li>
                <li>• I'm always working to improve my skills</li>
                <li>• I handle difficult conversations with professionalism</li>
              </ul>
            </div>

            {/* Complete Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleComplete}
                disabled={!isFormComplete}
                className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3"
                size="lg"
              >
                <Heart className="h-5 w-5" />
                <span>Complete Exercise</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}