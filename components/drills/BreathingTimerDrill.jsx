'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function BreathingTimerDrill({ drill, onComplete, onCancel }) {
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
  const [cycle, setCycle] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);

  // 4-7-8 breathing pattern (scaled for 90 seconds)
  const breathingPattern = {
    inhale: 4,
    hold: 7,
    exhale: 8
  };

  const totalCycleTime = breathingPattern.inhale + breathingPattern.hold + breathingPattern.exhale;
  const totalCycles = Math.floor(90 / totalCycleTime);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
        setPhaseTime(phaseTime => phaseTime + 1);
        
        // Update breathing phase
        if (phase === 'ready') {
          setPhase('inhale');
          setPhaseTime(0);
        } else if (phase === 'inhale' && phaseTime >= breathingPattern.inhale - 1) {
          setPhase('hold');
          setPhaseTime(0);
        } else if (phase === 'hold' && phaseTime >= breathingPattern.hold - 1) {
          setPhase('exhale');
          setPhaseTime(0);
        } else if (phase === 'exhale' && phaseTime >= breathingPattern.exhale - 1) {
          setPhase('inhale');
          setPhaseTime(0);
          setCycle(cycle => cycle + 1);
        }
      }, 1000);
    } else if (timeLeft === 0 && !isComplete) {
      setIsComplete(true);
      setIsRunning(false);
      setTimeout(() => {
        onComplete(drill.id, {
          type: 'breathing-exercise',
          duration: 90,
          completedCycles: cycle,
          completionTime: new Date().toISOString()
        });
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, phase, phaseTime, cycle, isComplete, drill.id, onComplete]);

  const handleStart = () => {
    setIsRunning(true);
    if (phase === 'ready') {
      setPhase('inhale');
      setPhaseTime(0);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(90);
    setIsRunning(false);
    setPhase('ready');
    setPhaseTime(0);
    setCycle(0);
    setIsComplete(false);
  };

  const progress = ((90 - timeLeft) / 90) * 100;
  const cycleProgress = cycle > 0 ? (cycle / totalCycles) * 100 : 0;

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'ready':
        return 'Get comfortable and prepare to begin';
      case 'inhale':
        return 'Breathe in slowly through your nose';
      case 'hold':
        return 'Hold your breath gently';
      case 'exhale':
        return 'Breathe out slowly through your mouth';
      default:
        return '';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'text-blue-600';
      case 'hold': return 'text-yellow-600';
      case 'exhale': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPhaseProgress = () => {
    const maxTime = breathingPattern[phase] || 1;
    return (phaseTime / maxTime) * 100;
  };

  if (isComplete) {
    return (
      <Card className="max-w-2xl mx-auto border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Well Done!</h2>
          <p className="text-gray-600 mb-4">
            You've completed the 90-second reset breathing exercise. This technique helps activate your parasympathetic nervous system and reset your emotional state.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#6495ED]">{cycle}</p>
                <p className="text-sm text-gray-600">Breathing Cycles</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">90s</p>
                <p className="text-sm text-gray-600">Focus Time</p>
              </div>
            </div>
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
                  <span className="text-2xl">🧘</span>
                  <span>90-Second Reset</span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  4-7-8 Breathing Pattern for Emotional Reset
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Timer */}
      <Card className="border-0 shadow-xl mb-6">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Large Timer Display */}
            <div className="relative">
              <div className="w-48 h-48 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6495ED" />
                      <stop offset="100%" stopColor="#4169E1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </div>
                  <div className={`text-sm font-medium ${getPhaseColor()}`}>
                    {phase.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Phase Instruction */}
            <div className="text-center">
              <p className={`text-xl font-medium ${getPhaseColor()}`}>
                {getPhaseInstruction()}
              </p>
              {phase !== 'ready' && (
                <div className="mt-4 max-w-sm mx-auto">
                  <Progress 
                    value={getPhaseProgress()} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Phase {phaseTime + 1} of {breathingPattern[phase]} seconds
                  </p>
                </div>
              )}
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
                onClick={isRunning ? handlePause : handleStart}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white px-8 py-3"
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
                    <span>{timeLeft === 90 ? 'Start' : 'Resume'}</span>
                  </>
                )}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 max-w-sm mx-auto">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-[#6495ED]">{cycle}</p>
                <p className="text-xs text-gray-600">Cycles Complete</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-green-600">{Math.round(cycleProgress)}%</p>
                <p className="text-xs text-gray-600">Session Progress</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-0 shadow-lg bg-blue-50">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-2">4-7-8 Breathing Instructions:</h3>
          <div className="space-y-1 text-sm text-gray-700">
            <p>• <strong>Inhale</strong> through your nose for 4 seconds</p>
            <p>• <strong>Hold</strong> your breath for 7 seconds</p>
            <p>• <strong>Exhale</strong> through your mouth for 8 seconds</p>
            <p className="text-xs text-gray-600 mt-2">
              This technique helps activate your body's relaxation response and reset your emotional state after challenging interactions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}