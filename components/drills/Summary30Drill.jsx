'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle2, Clock, Play, Pause } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const conversationScenarios = [
  {
    id: 1,
    title: "Software Implementation Discussion",
    conversation: [
      "Client: We've been struggling with our current CRM system. It's outdated and our team finds it difficult to use.",
      "You: What specific challenges are you facing with the current system?",
      "Client: Well, it's slow, the reporting is terrible, and it doesn't integrate with our other tools. Plus, training new employees takes forever.",
      "You: That sounds frustrating. How is this impacting your team's productivity?",
      "Client: Our sales team is spending more time fighting the system than selling. We're probably losing deals because of poor follow-up tracking.",
      "You: I can see why you're looking for a change. What would an ideal solution look like for your team?"
    ],
    keyPoints: [
      "Current CRM is outdated and difficult to use",
      "System is slow with poor reporting capabilities", 
      "No integration with existing tools",
      "Long training time for new employees",
      "Sales team productivity is suffering",
      "Losing deals due to poor follow-up tracking",
      "Looking for a more user-friendly solution"
    ]
  },
  {
    id: 2,
    title: "Budget and Timeline Concerns",
    conversation: [
      "Client: I'm interested in your solution, but I need to understand the investment and timeline.",
      "You: Of course. What's your current budget range for this type of project?",
      "Client: We have about $50,000 allocated, but that needs to cover everything - software, implementation, and training.",
      "You: That's helpful to know. What's your ideal timeline for getting this up and running?",
      "Client: We'd like to have everything in place by the end of Q2. Our busy season starts in Q3 and we can't afford disruptions then.",
      "You: I understand the timing is critical. What happens if we can't meet that Q2 deadline?"
    ],
    keyPoints: [
      "Budget of $50,000 for complete solution",
      "Must include software, implementation, and training",
      "Deadline is end of Q2",
      "Q3 is busy season - no disruptions allowed",
      "Timeline is critical to success",
      "Need to understand consequences of delays"
    ]
  }
];

export default function Summary30Drill({ drill, onComplete, onCancel }) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [summary, setSummary] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showConversation, setShowConversation] = useState(true);
  const [score, setScore] = useState(0);

  const scenario = conversationScenarios[currentScenario];

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
    setShowConversation(false);
    setTimeLeft(30);
    setSummary('');
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleResume = () => {
    setIsActive(true);
  };

  const handleSubmit = () => {
    setIsActive(false);
    calculateScore();
  };

  const handleTimeUp = () => {
    setIsActive(false);
    calculateScore();
  };

  const calculateScore = () => {
    if (!summary.trim()) {
      setScore(0);
      return;
    }

    const summaryLower = summary.toLowerCase();
    let points = 0;
    let foundPoints = [];

    // Check for key points mentioned
    scenario.keyPoints.forEach(point => {
      const keywords = point.toLowerCase().split(' ').filter(word => 
        word.length > 3 && !['with', 'that', 'this', 'they', 'have', 'been', 'will', 'from'].includes(word)
      );
      
      const matches = keywords.filter(keyword => summaryLower.includes(keyword));
      if (matches.length >= 2) {
        points += 15;
        foundPoints.push(point);
      }
    });

    // Bonus for structure and clarity
    if (summaryLower.includes('main') || summaryLower.includes('key') || summaryLower.includes('summary')) {
      points += 10;
    }

    // Bonus for mentioning client concerns
    if (summaryLower.includes('concern') || summaryLower.includes('challenge') || summaryLower.includes('issue')) {
      points += 10;
    }

    // Bonus for conciseness (under 150 words)
    const wordCount = summary.trim().split(/\s+/).length;
    if (wordCount <= 150) {
      points += 10;
    }

    setScore(Math.min(points, 100));
    
    setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => {
        onComplete(drill.id, {
          type: 'summary-30',
          score: Math.min(points, 100),
          wordCount,
          keyPointsCovered: foundPoints.length,
          timeUsed: 30 - timeLeft,
          completionTime: new Date().toISOString()
        });
      }, 2000);
    }, 1000);
  };

  const progress = ((30 - timeLeft) / 30) * 100;

  if (isComplete) {
    return (
      <Card className="max-w-3xl mx-auto border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Summary Complete!</h2>
          <p className="text-gray-600 mb-4">
            You've practiced the essential skill of quickly summarizing key conversation points.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-[#6495ED]">{score}</p>
              <p className="text-sm text-gray-600">Score</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600">{30 - timeLeft}s</p>
              <p className="text-sm text-gray-600">Time Used</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-purple-600">{summary.trim().split(/\s+/).length}</p>
              <p className="text-sm text-gray-600">Words</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> Great summaries capture the main points, acknowledge emotions, and confirm understanding. Practice this skill to build trust and ensure alignment.
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
                  <span className="text-2xl">⏱️</span>
                  <span>Summary-30 Challenge</span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Summarize the key conversation points in 30 seconds
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-[#6495ED]'}`}>
                {timeLeft}s
              </div>
              <div className="text-xs text-gray-500">Remaining</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Conversation */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="text-lg">{scenario.title}</CardTitle>
            <p className="text-sm text-gray-600">Read the conversation, then summarize the key points</p>
          </CardHeader>
          <CardContent className="p-6">
            {showConversation ? (
              <div className="space-y-3 mb-6">
                {scenario.conversation.map((line, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    line.startsWith('Client:') ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50'
                  }`}>
                    <p className="text-sm">
                      <strong className={line.startsWith('Client:') ? 'text-blue-700' : 'text-gray-700'}>
                        {line.split(':')[0]}:
                      </strong>
                      <span className="ml-2">{line.split(':').slice(1).join(':')}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Conversation hidden during summary</p>
                <p className="text-sm">Focus on what you remember</p>
              </div>
            )}

            {!isActive && showConversation && (
              <Button 
                onClick={handleStart}
                className="w-full bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Start 30-Second Summary
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Summary Area */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Summary</span>
              {isActive && (
                <Progress value={progress} className="w-24 h-2" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isActive || summary ? (
              <div className="space-y-4">
                <Textarea
                  placeholder="Summarize the key points from the conversation. Focus on the main concerns, requirements, and next steps..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="min-h-[200px]"
                  disabled={!isActive && timeLeft === 0}
                  autoFocus={isActive}
                />
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{summary.trim().split(/\s+/).filter(word => word.length > 0).length} words</span>
                  <span>Target: Under 150 words</span>
                </div>

                <div className="flex space-x-2">
                  {isActive ? (
                    <>
                      <Button 
                        onClick={handlePause}
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <Pause className="h-4 w-4" />
                        <span>Pause</span>
                      </Button>
                      <Button 
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-[#6495ED] to-blue-600"
                        disabled={!summary.trim()}
                      >
                        Submit Summary
                      </Button>
                    </>
                  ) : timeLeft > 0 && summary && (
                    <Button 
                      onClick={handleResume}
                      className="w-full bg-gradient-to-r from-[#6495ED] to-blue-600"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Click "Start 30-Second Summary" to begin</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="mt-6 border-0 shadow-lg bg-blue-50">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-2">Summary Best Practices:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong>Include:</strong> Main concerns, key requirements, timeline, budget constraints
            </div>
            <div>
              <strong>Structure:</strong> "The main points I heard were..." or "To summarize..."
            </div>
            <div>
              <strong>Acknowledge:</strong> Emotions and concerns expressed by the client
            </div>
            <div>
              <strong>Confirm:</strong> "Did I capture everything correctly?" or "What did I miss?"
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}