'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Target, Plus, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function OneOutcomeThreeActionsDrill({ drill, onComplete, onCancel }) {
  const [outcome, setOutcome] = useState('');
  const [actions, setActions] = useState(['', '', '']);
  const [isComplete, setIsComplete] = useState(false);
  const [priority, setPriority] = useState('high');

  const handleActionChange = (index, value) => {
    const newActions = [...actions];
    newActions[index] = value;
    setActions(newActions);
  };

  const addAction = () => {
    if (actions.length < 5) {
      setActions([...actions, '']);
    }
  };

  const removeAction = (index) => {
    if (actions.length > 3) {
      const newActions = actions.filter((_, i) => i !== index);
      setActions(newActions);
    }
  };

  const isFormComplete = () => {
    return outcome.trim().length > 0 && actions.filter(action => action.trim().length > 0).length >= 3;
  };

  const handleComplete = () => {
    if (!isFormComplete()) return;
    
    const completedActions = actions.filter(action => action.trim().length > 0);
    
    setIsComplete(true);
    setTimeout(() => {
      onComplete(drill.id, {
        type: 'goal-setting',
        outcome: outcome.trim(),
        actions: completedActions,
        priority,
        completionTime: new Date().toISOString(),
        actionCount: completedActions.length
      });
    }, 2000);
  };

  if (isComplete) {
    const completedActions = actions.filter(action => action.trim().length > 0);
    
    return (
      <Card className="max-w-3xl mx-auto border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Goal Set Successfully!</h2>
          <p className="text-gray-600 mb-6">
            You've defined a clear outcome with specific leading actions. This structured approach helps maintain focus on what matters most.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-bold text-gray-900 mb-4 text-center">Your Daily Goal Plan:</h3>
            
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-5 w-5 text-[#6495ED]" />
                <span className="font-medium text-gray-900">Target Outcome:</span>
                <Badge className={`${
                  priority === 'high' ? 'bg-red-100 text-red-800' :
                  priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                </Badge>
              </div>
              <p className="text-gray-800 bg-blue-50 rounded-lg p-3 ml-7">
                {outcome}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Leading Actions:</h4>
              <div className="space-y-2">
                {completedActions.map((action, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-white rounded-lg p-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-[#6495ED] to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-800">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> Review this plan first thing tomorrow morning and track your progress on each action. Leading actions drive outcomes!
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
                  <span>One Outcome + Three Leading Actions</span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Daily Goal Setting Exercise - Focus on Leading Metrics
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Instructions & Tips */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardTitle className="text-lg">Goal Setting Framework</CardTitle>
            <p className="text-sm text-gray-600">Structure your daily focus for maximum impact</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Target className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Focus on Leading Metrics:</strong> Choose actions that directly influence your desired outcome, not just the outcome itself.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Examples of Good Outcomes:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• "Schedule 3 qualified discovery meetings this week"</li>
                  <li>• "Advance 2 prospects to proposal stage"</li>
                  <li>• "Complete follow-up with all pending prospects"</li>
                  <li>• "Increase call connection rate to 25%"</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-3">Leading Actions Should Be:</h4>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>• <strong>Specific:</strong> Clear and measurable</li>
                  <li>• <strong>Actionable:</strong> Within your control</li>
                  <li>• <strong>Time-bound:</strong> Can be done today</li>
                  <li>• <strong>Impactful:</strong> Directly drive the outcome</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goal Setting Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Today's Goal Plan</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Define one key outcome and the actions that will drive it
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Priority Level */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Priority Level</Label>
                <div className="flex space-x-2">
                  {['high', 'medium', 'low'].map((level) => (
                    <Button
                      key={level}
                      variant={priority === level ? "default" : "outline"}
                      onClick={() => setPriority(level)}
                      className={`capitalize ${
                        priority === level
                          ? level === 'high' ? 'bg-red-500 hover:bg-red-600' :
                            level === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                            'bg-green-500 hover:bg-green-600'
                          : 'hover:bg-gray-50'
                      }`}
                      size="sm"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Outcome Input */}
              <div className="space-y-2">
                <Label htmlFor="outcome" className="text-base font-medium flex items-center space-x-2">
                  <Target className="h-4 w-4 text-[#6495ED]" />
                  <span>Target Outcome (What do you want to achieve?)</span>
                </Label>
                <Textarea
                  id="outcome"
                  placeholder="Example: Schedule 2 qualified discovery meetings by end of week..."
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className="min-h-[80px] text-base"
                />
                <div className="text-xs text-gray-500">
                  {outcome.length}/20 characters minimum
                </div>
              </div>

              {/* Actions Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Leading Actions (What will drive this outcome?)</Label>
                  {actions.length < 5 && (
                    <Button
                      onClick={addAction}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Action</span>
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3">
                  {actions.map((action, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm font-medium">Action #{index + 1}</Label>
                        {actions.length > 3 && (
                          <Button
                            onClick={() => removeAction(index)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <Input
                        placeholder={`Example: Make 10 targeted cold calls to prospects in healthcare sector...`}
                        value={action}
                        onChange={(e) => handleActionChange(index, e.target.value)}
                        className="text-base"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleComplete}
                  disabled={!isFormComplete()}
                  className="flex items-center space-x-2 bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white px-8 py-3"
                  size="lg"
                >
                  <Target className="h-5 w-5" />
                  <span>Set Daily Goal</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Methodology Info */}
      <Card className="mt-6 border-0 shadow-lg bg-blue-50">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-2">Based on Goal Setting Theory & OKR Framework:</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <strong>Outcome Focus:</strong> Clear, specific targets that matter to your success
            </div>
            <div>
              <strong>Leading Actions:</strong> Controllable activities that drive the outcome
            </div>
            <div>
              <strong>Daily Review:</strong> Regular check-ins to maintain focus and adjust course
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}