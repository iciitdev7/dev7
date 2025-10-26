'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Heart, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const emotionalScenarios = [
  {
    id: 1,
    title: "Budget Pressure",
    description: "A client discussing financial constraints",
    quote: "I really want to move forward with this, but honestly, I'm not sure how I'm going to justify this expense to my boss. We've already gone over budget this quarter, and I'm worried about how this will look.",
    correctEmotions: ["anxious", "worried", "conflicted"],
    incorrectEmotions: ["angry", "excited", "confident", "frustrated"],
    context: "The client wants the solution but is concerned about budget approval and perception."
  },
  {
    id: 2,
    title: "Past Vendor Issues",
    description: "A client sharing previous bad experiences",
    quote: "Our last vendor promised the world and delivered nothing. We wasted six months and thousands of dollars. I'm just... I don't know if I can go through that again. How do I know you're different?",
    correctEmotions: ["skeptical", "hurt", "cautious"],
    incorrectEmotions: ["optimistic", "trusting", "indifferent", "happy"],
    context: "The client has been burned before and is hesitant to trust again."
  },
  {
    id: 3,
    title: "Urgent Need",
    description: "A client under time pressure",
    quote: "We need this implemented yesterday. Our current system crashed last week and we're basically running everything manually. My team is working overtime and everyone's stressed. We can't continue like this much longer.",
    correctEmotions: ["stressed", "urgent", "overwhelmed"],
    incorrectEmotions: ["relaxed", "patient", "calm", "satisfied"],
    context: "The client is in crisis mode and needs immediate solutions."
  },
  {
    id: 4,
    title: "Decision Paralysis",
    description: "A client struggling with too many options",
    quote: "I've been looking at solutions for months now. Everyone says their product is the best, and I honestly don't know how to choose anymore. What if I pick the wrong one? This decision could affect our entire department.",
    correctEmotions: ["overwhelmed", "indecisive", "pressured"],
    incorrectEmotions: ["confident", "certain", "relaxed", "excited"],
    context: "The client feels paralyzed by too many choices and the weight of the decision."
  },
  {
    id: 5,
    title: "Team Resistance",
    description: "A client facing internal pushback",
    quote: "I think this could really help us, but my team is resistant to change. They've been using the same process for years, and every time I mention updating our systems, I get pushback. I'm caught in the middle here.",
    correctEmotions: ["frustrated", "torn", "isolated"],
    incorrectEmotions: ["supported", "confident", "united", "optimistic"],
    context: "The client sees the value but faces internal resistance from their team."
  }
];

export default function EmotionalLabelingDrill({ drill, onComplete, onCancel }) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [scenarioResults, setScenarioResults] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const scenario = emotionalScenarios[currentScenario];
  const allEmotions = [...scenario.correctEmotions, ...scenario.incorrectEmotions].sort();

  const handleEmotionToggle = (emotion) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSubmit = () => {
    const correctSelected = selectedEmotions.filter(e => scenario.correctEmotions.includes(e));
    const incorrectSelected = selectedEmotions.filter(e => scenario.incorrectEmotions.includes(e));
    
    const score = Math.max(0, (correctSelected.length * 25) - (incorrectSelected.length * 10));
    
    const result = {
      scenarioId: scenario.id,
      selectedEmotions: [...selectedEmotions],
      correctSelected,
      incorrectSelected,
      score,
      maxScore: scenario.correctEmotions.length * 25
    };

    setScenarioResults(prev => [...prev, result]);
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentScenario < emotionalScenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedEmotions([]);
      setShowResults(false);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const totalScore = scenarioResults.reduce((sum, result) => sum + result.score, 0);
    const maxPossibleScore = scenarioResults.reduce((sum, result) => sum + result.maxScore, 0);
    const accuracy = Math.round((totalScore / maxPossibleScore) * 100);

    setIsComplete(true);
    setTimeout(() => {
      onComplete(drill.id, {
        type: 'emotional-labeling',
        totalScore,
        accuracy,
        scenariosCompleted: scenarioResults.length,
        results: scenarioResults,
        completionTime: new Date().toISOString()
      });
    }, 2000);
  };

  if (isComplete) {
    const totalScore = scenarioResults.reduce((sum, result) => sum + result.score, 0);
    const maxPossibleScore = scenarioResults.reduce((sum, result) => sum + result.maxScore, 0);
    const accuracy = Math.round((totalScore / maxPossibleScore) * 100);

    return (
      <Card className="max-w-3xl mx-auto border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-pink-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Excellent Emotional Intelligence!</h2>
          <p className="text-gray-600 mb-4">
            You've practiced identifying and labeling emotions in client conversations. This skill builds empathy and trust.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-pink-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-pink-600">{accuracy}%</p>
              <p className="text-sm text-gray-600">Accuracy</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-[#6495ED]">{scenarioResults.length}</p>
              <p className="text-sm text-gray-600">Scenarios</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600">{totalScore}</p>
              <p className="text-sm text-gray-600">Total Score</p>
            </div>
          </div>
          <div className="bg-pink-50 rounded-lg p-4">
            <p className="text-sm text-pink-800">
              <strong>Pro Tip:</strong> Emotional labeling helps clients feel heard and understood. Use phrases like "It sounds like you're feeling..." to reflect emotions back to them.
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
                  <span className="text-2xl">💝</span>
                  <span>Emotional Labeling Practice</span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Scenario {currentScenario + 1} of {emotionalScenarios.length} - Identify client emotions
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#6495ED]">
                {Math.round(((currentScenario + (showResults ? 1 : 0)) / emotionalScenarios.length) * 100)}%
              </div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scenario */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
            <CardTitle className="text-lg">{scenario.title}</CardTitle>
            <p className="text-sm text-gray-600">{scenario.description}</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-800 italic">"{scenario.quote}"</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Context:</h4>
              <p className="text-sm text-blue-800">{scenario.context}</p>
            </div>
          </CardContent>
        </Card>

        {/* Emotion Selection */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Select the emotions you identify</CardTitle>
            <p className="text-sm text-gray-600">Choose all emotions that apply to this client's state</p>
          </CardHeader>
          <CardContent className="p-6">
            {!showResults ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {allEmotions.map((emotion) => (
                    <Button
                      key={emotion}
                      variant={selectedEmotions.includes(emotion) ? "default" : "outline"}
                      onClick={() => handleEmotionToggle(emotion)}
                      className={`justify-start capitalize ${
                        selectedEmotions.includes(emotion)
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                          : 'hover:bg-pink-50'
                      }`}
                    >
                      {emotion}
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={selectedEmotions.length === 0}
                  className="w-full bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white mt-6"
                >
                  Submit Analysis
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-[#6495ED] mb-1">
                    {scenarioResults[scenarioResults.length - 1].score}
                  </div>
                  <div className="text-sm text-gray-600">Points Earned</div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">✓ Correct Emotions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {scenario.correctEmotions.map((emotion) => (
                        <Badge 
                          key={emotion} 
                          className={`capitalize ${
                            selectedEmotions.includes(emotion)
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {emotion} {selectedEmotions.includes(emotion) ? '✓' : '(missed)'}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {scenarioResults[scenarioResults.length - 1].incorrectSelected.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-700 mb-2">✗ Incorrect Selections:</h4>
                      <div className="flex flex-wrap gap-2">
                        {scenarioResults[scenarioResults.length - 1].incorrectSelected.map((emotion) => (
                          <Badge key={emotion} className="capitalize bg-red-100 text-red-800">
                            {emotion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white mt-6"
                >
                  {currentScenario < emotionalScenarios.length - 1 ? (
                    <>
                      Next Scenario
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    'Complete Exercise'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="mt-6 border-0 shadow-lg bg-pink-50">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-2">Emotional Labeling Tips:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong>Listen for:</strong> Tone, word choice, hesitation, emphasis
            </div>
            <div>
              <strong>Reflect with:</strong> "It sounds like you're feeling..." or "I sense that you're..."
            </div>
            <div>
              <strong>Validate:</strong> "That makes complete sense given the situation"
            </div>
            <div>
              <strong>Explore:</strong> "Tell me more about that concern"
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}