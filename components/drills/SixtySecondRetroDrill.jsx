'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Play, Pause, RotateCcw, Clock, Star } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const retroPrompts = [
  {
    id: 1,
    category: "Achievements",
    question: "What did I accomplish today that I'm proud of?",
    placeholder: "I successfully completed... I made progress on... I helped...",
    icon: "🏆",
    color: "green"
  },
  {
    id: 2,
    category: "Learning",
    question: "What did I learn about myself or my work today?",
    placeholder: "I discovered that... I realized... I learned...",
    icon: "💡",
    color: "blue"
  },
  {
    id: 3,
    category: "Gratitude",
    question: "What am I grateful for from today?",
    placeholder: "I'm thankful for... I appreciate... I'm grateful that...",
    icon: "🙏",
    color: "purple"
  }
];

export default function SixtySecondRetroDrill({ drill, onComplete, onCancel }) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [responses, setResponses] = useState({});
  const [currentResponse, setCurrentResponse] = useState('');

  const prompt = retroPrompts[currentPrompt];
  const progress = ((60 - timeLeft) / 60) * 100;
  const timePerPrompt = 20; // 20 seconds per prompt
  const promptProgress = ((timePerPrompt - (timeLeft % timePerPrompt)) / timePerPrompt) * 100;

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          const newTimeLeft = timeLeft - 1;
          
          // Auto-advance to next prompt every 20 seconds
          if (newTimeLeft > 0 && newTimeLeft % 20 === 0 && currentPrompt < 2) {
            handleNextPrompt();
          }
          
          return newTimeLeft;
        });
      }, 1000);
    } else if (timeLeft === 0 && !isComplete) {
      handleTimeUp();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentPrompt, isComplete]);

  const handleStart = () => {
    setIsRunning(true);
    setCurrentPrompt(0);
    setCurrentResponse('');
    setResponses({});
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsRunning(true);
  };

  const handleReset = () => {
    setTimeLeft(60);
    setIsRunning(false);
    setCurrentPrompt(0);
    setCurrentResponse('');
    setResponses({});
    setIsComplete(false);
  };

  const handleNextPrompt = () => {
    // Save current response
    if (currentResponse.trim()) {
      setResponses(prev => ({
        ...prev,
        [currentPrompt]: currentResponse.trim()
      }));
    }

    if (currentPrompt < 2) {
      setCurrentPrompt(currentPrompt + 1);
      setCurrentResponse('');
    }
  };

  const handleTimeUp = () => {
    // Save final response
    if (currentResponse.trim()) {
      setResponses(prev => ({
        ...prev,
        [currentPrompt]: currentResponse.trim()
      }));
    }

    setIsRunning(false);
    setIsComplete(true);
    
    setTimeout(() => {
      const completedResponses = Object.keys(responses).length + (currentResponse.trim() ? 1 : 0);
      onComplete(drill.id, {
        type: 'mini-retrospective',
        responses: {
          ...responses,
          ...(currentResponse.trim() ? { [currentPrompt]: currentResponse.trim() } : {})
        },
        completedPrompts: completedResponses,
        totalTime: 60,
        completionTime: new Date().toISOString()
      });
    }, 2000);
  };

  const formatTime = (seconds) => {
    return `${seconds}s`;
  };

  if (isComplete) {
    const finalResponses = {
      ...responses,
      ...(currentResponse.trim() ? { [currentPrompt]: currentResponse.trim() } : {})
    };
    const completedCount = Object.keys(finalResponses).length;

    return (
      <Card className="max-w-3xl mx-auto border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reflection Complete!</h2>
          <p className="text-gray-600 mb-6">
            You've completed your 60-second mini-retrospective. Regular reflection builds self-awareness and maintains motivation.
          </p>
          
          {completedCount > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-bold text-gray-900 mb-4 text-center">Your Reflections:</h3>
              <div className="space-y-4">
                {Object.entries(finalResponses).map(([promptIndex, response]) => {
                  const promptData = retroPrompts[parseInt(promptIndex)];
                  return (
                    <div key={promptIndex} className={`bg-${promptData.color}-50 rounded-lg p-4`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{promptData.icon}</span>
                        <h4 className={`font-medium text-${promptData.color}-900`}>
                          {promptData.category}
                        </h4>
                      </div>
                      <p className={`text-${promptData.color}-800 text-sm`}>{response}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-[#6495ED]">{completedCount}</p>
              <p className="text-sm text-gray-600">Reflections</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600">60s</p>
              <p className="text-sm text-gray-600">Focus Time</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> Make this a daily habit! Regular micro-reflections compound into significant self-awareness and motivation over time.
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
                  <span className="text-2xl">⏱️</span>
                  <span>Sixty Second Mini-Retro</span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Quick daily reflection on achievements and learnings
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-[#6495ED]'}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-gray-500">Remaining</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Timer and Content */}
      <Card className="border-0 shadow-xl mb-6">
        <CardContent className="p-8">
          {!isRunning && timeLeft === 60 ? (
            // Start Screen
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-r from-[#6495ED] to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Clock className="h-12 w-12 text-white" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready for Your Mini-Retro?</h2>
                <p className="text-gray-600 mb-4">
                  Spend 60 seconds reflecting on your day across three key areas
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {retroPrompts.map((prompt, index) => (
                  <div key={prompt.id} className={`bg-${prompt.color}-50 rounded-lg p-4 text-center`}>
                    <div className="text-2xl mb-2">{prompt.icon}</div>
                    <h3 className={`font-medium text-${prompt.color}-900 mb-1`}>{prompt.category}</h3>
                    <p className={`text-xs text-${prompt.color}-700`}>~20 seconds</p>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleStart}
                className="bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white px-8 py-3"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start 60-Second Reflection
              </Button>
            </div>
          ) : (
            // Active Reflection Screen
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Overall Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Current Prompt */}
              <div className={`bg-${prompt.color}-50 rounded-lg p-6 text-center`}>
                <div className="text-4xl mb-3">{prompt.icon}</div>
                <Badge className={`bg-${prompt.color}-100 text-${prompt.color}-800 mb-3`}>
                  {prompt.category} ({currentPrompt + 1}/3)
                </Badge>
                <h3 className={`text-xl font-bold text-${prompt.color}-900 mb-4`}>
                  {prompt.question}
                </h3>
                
                <Textarea
                  placeholder={prompt.placeholder}
                  value={currentResponse}
                  onChange={(e) => setCurrentResponse(e.target.value)}
                  className="min-h-[100px] text-base bg-white"
                  autoFocus
                />
              </div>

              {/* Controls */}
              <div className="flex justify-center items-center space-x-4">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </Button>

                <Button
                  onClick={isRunning ? handlePause : handleResume}
                  className="flex items-center space-x-2 bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white px-6"
                  size="lg"
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-5 w-5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      <span>Resume</span>
                    </>
                  )}
                </Button>

                {currentPrompt < 2 && (
                  <Button
                    onClick={handleNextPrompt}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                )}
              </div>

              {/* Prompt Progress */}
              <div className="text-center">
                <div className="flex justify-center space-x-2 mb-2">
                  {retroPrompts.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === currentPrompt
                          ? `bg-${prompt.color}-500`
                          : index < currentPrompt
                          ? 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {currentPrompt + 1} of 3 reflection areas
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-0 shadow-lg bg-blue-50">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-2">Reflection Benefits:</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <strong>Achievements:</strong> Builds confidence and recognizes progress
            </div>
            <div>
              <strong>Learning:</strong> Increases self-awareness and growth mindset
            </div>
            <div>
              <strong>Gratitude:</strong> Enhances well-being and motivation
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}