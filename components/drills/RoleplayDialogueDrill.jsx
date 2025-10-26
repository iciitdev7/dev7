'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, MessageCircle, Clock, Target } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const clientScenarios = [
  {
    id: 1,
    name: "Sarah - Marketing Director",
    situation: "Budget concerns for new software",
    initialMessage: "I'm interested in your solution, but honestly, I'm not sure we have the budget for something like this right now. We've had some unexpected expenses this quarter.",
    emotions: ["concerned", "hesitant", "pressured"],
    responses: [
      {
        type: "reflection",
        text: "It sounds like budget timing is a real concern for you right now, especially with those unexpected expenses.",
        score: 95
      },
      {
        type: "open_question", 
        text: "What would need to happen for this to fit within your budget constraints?",
        score: 85
      },
      {
        type: "poor",
        text: "Well, let me show you our payment plans that can work with any budget.",
        score: 20
      }
    ]
  },
  {
    id: 2,
    name: "Mike - Operations Manager", 
    situation: "Frustrated with current vendor",
    initialMessage: "Our current system is driving me crazy. It's slow, the support is terrible, and my team is constantly complaining. But I'm worried about the disruption of switching to something new.",
    emotions: ["frustrated", "worried", "overwhelmed"],
    responses: [
      {
        type: "reflection",
        text: "You're feeling really frustrated with your current system, but you're also concerned about the potential disruption of making a change.",
        score: 98
      },
      {
        type: "affirmation",
        text: "It takes courage to consider making a change when you're already dealing with so many challenges.",
        score: 88
      },
      {
        type: "poor",
        text: "Don't worry, our implementation is really smooth and won't cause any problems.",
        score: 15
      }
    ]
  }
];

export default function RoleplayDialogueDrill({ drill, onComplete, onCancel }) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [reflections, setReflections] = useState([]);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState('');

  const scenario = clientScenarios[currentScenario];

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
    setTimeLeft(120);
    setReflections([]);
    setUserResponse('');
    setFeedback('');
  };

  const handleSubmitResponse = () => {
    if (!userResponse.trim()) return;

    // Simple scoring based on keywords and structure
    const response = userResponse.toLowerCase();
    let score = 0;
    let type = 'statement';

    // Check for reflection patterns
    if (response.includes('sounds like') || response.includes('it seems') || 
        response.includes('you feel') || response.includes('you\'re saying')) {
      score += 40;
      type = 'reflection';
    }

    // Check for emotional words
    scenario.emotions.forEach(emotion => {
      if (response.includes(emotion)) score += 20;
    });

    // Check for open questions
    if (response.includes('?') && (response.includes('what') || response.includes('how') || 
        response.includes('when') || response.includes('where') || response.includes('why'))) {
      score += 30;
      type = 'open_question';
    }

    // Check for affirmations
    if (response.includes('appreciate') || response.includes('understand') || 
        response.includes('makes sense') || response.includes('courage')) {
      score += 25;
      type = 'affirmation';
    }

    const newReflection = {
      text: userResponse,
      score: Math.min(score, 100),
      type,
      timestamp: Date.now()
    };

    setReflections(prev => [...prev, newReflection]);
    setUserResponse('');

    // Provide feedback
    if (score >= 70) {
      setFeedback('Excellent reflection! You captured the emotion and content well.');
    } else if (score >= 40) {
      setFeedback('Good attempt. Try to reflect both the content and emotion you heard.');
    } else {
      setFeedback('Try using reflection language like "It sounds like..." or "You feel..."');
    }

    // Check if goal achieved
    if (reflections.length + 1 >= 3) {
      handleSuccess();
    }
  };

  const handleTimeUp = () => {
    setIsActive(false);
    if (reflections.length >= 3) {
      handleSuccess();
    } else {
      setFeedback(`Time's up! You achieved ${reflections.length} reflections. Try again to reach the goal of 3.`);
    }
  };

  const handleSuccess = () => {
    setIsActive(false);
    setIsComplete(true);
    setTimeout(() => {
      onComplete(drill.id, {
        type: 'roleplay-dialogue',
        reflections: reflections.length,
        timeUsed: 120 - timeLeft,
        averageScore: reflections.reduce((sum, r) => sum + r.score, 0) / reflections.length,
        completionTime: new Date().toISOString()
      });
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isComplete) {
    return (
      <Card className="max-w-3xl mx-auto border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Excellent Work!</h2>
          <p className="text-gray-600 mb-4">
            You successfully achieved {reflections.length} reflections with the AI client. This builds trust and demonstrates active listening.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-[#6495ED]">{reflections.length}</p>
              <p className="text-sm text-gray-600">Reflections</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600">{formatTime(120 - timeLeft)}</p>
              <p className="text-sm text-gray-600">Time Used</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> Great reflections capture both content and emotion. Practice the OARS technique: Open questions, Affirmations, Reflections, and Summaries.
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
                  <span className="text-2xl">👂</span>
                  <span>AI Client Roleplay</span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Motivational Interviewing Practice - Achieve 3 Reflections in 2 Minutes
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold text-[#6495ED]">{reflections.length}/3</div>
                <div className="text-xs text-gray-500">Reflections</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${timeLeft <= 30 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="text-xs text-gray-500">Time Left</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Client Scenario */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-[#6495ED]" />
              <span>Client: {scenario.name}</span>
            </CardTitle>
            <p className="text-sm text-gray-600">{scenario.situation}</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-800 italic">"{scenario.initialMessage}"</p>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Emotions to identify:</h4>
              <div className="flex flex-wrap gap-2">
                {scenario.emotions.map((emotion, index) => (
                  <Badge key={index} variant="outline" className="bg-yellow-50 text-yellow-800">
                    {emotion}
                  </Badge>
                ))}
              </div>
            </div>

            {!isActive && reflections.length === 0 && (
              <Button 
                onClick={handleStart}
                className="w-full bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white"
              >
                <Target className="h-4 w-4 mr-2" />
                Start Roleplay
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Response Area */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Your Response</span>
              {isActive && <Badge className="bg-green-100 text-green-800">Active</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isActive ? (
              <div className="space-y-4">
                <Textarea
                  placeholder="Type your response to the client here. Focus on reflecting their emotions and content..."
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  className="min-h-[100px]"
                  autoFocus
                />
                <Button 
                  onClick={handleSubmitResponse}
                  disabled={!userResponse.trim()}
                  className="w-full bg-gradient-to-r from-[#6495ED] to-blue-600"
                >
                  Submit Response
                </Button>
                
                {feedback && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertDescription className="text-blue-800">
                      {feedback}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Click "Start Roleplay" to begin the exercise</p>
              </div>
            )}

            {/* Reflections History */}
            {reflections.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Your Reflections:</h4>
                <div className="space-y-2">
                  {reflections.map((reflection, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <p className="text-sm text-gray-800 flex-1">{reflection.text}</p>
                        <div className="ml-3 text-right">
                          <Badge 
                            className={`${reflection.score >= 70 ? 'bg-green-100 text-green-800' : 
                              reflection.score >= 40 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}
                          >
                            {reflection.score}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1 capitalize">{reflection.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="mt-6 border-0 shadow-lg bg-blue-50">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-2">OARS Technique Guide:</h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-700">
            <div>
              <strong>Open Questions:</strong> "What concerns you most about...?"
            </div>
            <div>
              <strong>Affirmations:</strong> "I appreciate your honesty..."
            </div>
            <div>
              <strong>Reflections:</strong> "It sounds like you're feeling..."
            </div>
            <div>
              <strong>Summaries:</strong> "Let me make sure I understand..."
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}