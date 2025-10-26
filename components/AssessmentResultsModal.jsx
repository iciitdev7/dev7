'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '../contexts/LanguageContext';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

const getRadarColor = (score) => {
  if (score >= 80) return '#16a34a';
  if (score >= 60) return '#2563eb';
  if (score >= 40) return '#ca8a04';
  return '#dc2626';
};

export default function AssessmentResultsModal({ isOpen, onClose, categoryScores }) {
  const { t } = useLanguage();

  if (!categoryScores) return null;

  const categories = Object.entries(categoryScores).map(([name, score]) => {
    const roundedScore = Math.round(score);

    return {
      name,
      score: roundedScore,
      displayName: t(`categoryNames.${name}`),
    };
  });

  const radarData = categories.map(cat => ({
    category: cat.displayName,
    score: cat.score,
    fullMark: 10,
  }));

  const overallScore = Math.round(
    categories.reduce((sum, c) => sum + c.score, 0) / categories.length
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t('assessmentResults.title')}
          </DialogTitle>
          <DialogDescription>
            {t('assessmentResults.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Card className="border-2 border-[#6495ED]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold">
                  {t('assessmentResults.overallScore')}
                </span>
                <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}/10
                </span>
              </div>
              <Progress value={overallScore * 10} className="h-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                {t('assessmentResults.categoryBreakdown')}
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fill: '#374151', fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 10]}
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#6495ED"
                    fill="#6495ED"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-sm">
                      {category.displayName}
                    </span>
                    <span className={`font-bold ${getScoreColor(category.score)}`}>
                      {category.score}/10
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED]"
            >
              {t('assessmentResults.startTraining')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
