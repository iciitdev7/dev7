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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBgColor = (score) => {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-blue-100';
  if (score >= 40) return 'bg-yellow-100';
  return 'bg-red-100';
};

export default function AssessmentResultsModal({ isOpen, onClose, categoryScores }) {
  const { t } = useLanguage();

  if (!categoryScores) return null;

  const categories = Object.entries(categoryScores).map(([name, score]) => {
    const roundedScore = Math.round(score);
    const feedback = {
      strengths: roundedScore >= 70 ? t(`categoryFeedback.${name}.strengths`) : null,
      weaknesses: roundedScore < 70 ? t(`categoryFeedback.${name}.weaknesses`) : null,
    };

    return {
      name,
      score: roundedScore,
      feedback,
    };
  });

  const sortedCategories = [...categories].sort((a, b) => b.score - a.score);
  const strengths = sortedCategories.filter(c => c.score >= 70);
  const areasForDevelopment = sortedCategories.filter(c => c.score < 70);

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

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              {t('assessmentResults.yourStrengths')}
            </h3>
            {strengths.length > 0 ? (
              <div className="space-y-3">
                {strengths.map((category) => (
                  <Card key={category.name} className="bg-green-50">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">
                          {t(`categoryNames.${category.name}`)}
                        </span>
                        <Badge className={`${getScoreBgColor(category.score)} ${getScoreColor(category.score)}`}>
                          {category.score}/10
                        </Badge>
                      </div>
                      {category.feedback.strengths && (
                        <p className="text-sm text-gray-700 mt-2">
                          {category.feedback.strengths}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                {t('assessmentResults.noStrengths')}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              {t('assessmentResults.areasForDevelopment')}
            </h3>
            {areasForDevelopment.length > 0 ? (
              <div className="space-y-3">
                {areasForDevelopment.map((category) => (
                  <Card key={category.name} className="bg-yellow-50">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">
                          {t(`categoryNames.${category.name}`)}
                        </span>
                        <Badge className={`${getScoreBgColor(category.score)} ${getScoreColor(category.score)}`}>
                          {category.score}/10
                        </Badge>
                      </div>
                      {category.feedback.weaknesses && (
                        <p className="text-sm text-gray-700 mt-2">
                          {category.feedback.weaknesses}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                {t('assessmentResults.noWeaknesses')}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              {t('assessmentResults.allCategories')}
            </h3>
            <div className="space-y-3">
              {sortedCategories.map((category) => (
                <Card key={category.name}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {t(`categoryNames.${category.name}`)}
                      </span>
                      <span className={`font-bold ${getScoreColor(category.score)}`}>
                        {category.score}/10
                      </span>
                    </div>
                    <Progress value={category.score * 10} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

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
