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
import { TrendingUp, TrendingDown, CheckCircle2, AlertCircle } from 'lucide-react';

const getCategoryFeedback = (category, score, language) => {
  const feedbacks = {
    en: {
      'Emotional Fortitude': {
        strengths: score >= 70
          ? 'You handle rejection and pressure well, bouncing back quickly from setbacks.'
          : null,
        weaknesses: score < 70
          ? 'Working on emotional resilience will help you recover faster from rejection and maintain motivation.'
          : null,
      },
      'Energy & Focus': {
        strengths: score >= 70
          ? 'You maintain strong focus and energy levels throughout your workday.'
          : null,
        weaknesses: score < 70
          ? 'Improving your energy management and focus techniques will boost your daily productivity.'
          : null,
      },
      'Confidence & Motivation': {
        strengths: score >= 70
          ? 'You demonstrate solid confidence and clear motivation in your sales approach.'
          : null,
        weaknesses: score < 70
          ? 'Building confidence and clarifying your goals will enhance your sales effectiveness.'
          : null,
      },
      'Communication & Empathy': {
        strengths: score >= 70
          ? 'You excel at understanding clients and building meaningful connections.'
          : null,
        weaknesses: score < 70
          ? 'Developing active listening and empathy skills will strengthen your client relationships.'
          : null,
      },
      'Adaptability & Problem-Solving': {
        strengths: score >= 70
          ? 'You adapt well to change and approach problems with creative solutions.'
          : null,
        weaknesses: score < 70
          ? 'Enhancing flexibility and problem-solving skills will help you navigate challenges more effectively.'
          : null,
      },
    },
    ru: {
      'Emotional Fortitude': {
        strengths: score >= 70
          ? 'Вы хорошо справляетесь с отказами и давлением, быстро восстанавливаетесь после неудач.'
          : null,
        weaknesses: score < 70
          ? 'Работа над эмоциональной устойчивостью поможет вам быстрее восстанавливаться после отказов и поддерживать мотивацию.'
          : null,
      },
      'Energy & Focus': {
        strengths: score >= 70
          ? 'Вы поддерживаете сильную концентрацию и высокий уровень энергии в течение рабочего дня.'
          : null,
        weaknesses: score < 70
          ? 'Улучшение управления энергией и техник концентрации повысит вашу ежедневную продуктивность.'
          : null,
      },
      'Confidence & Motivation': {
        strengths: score >= 70
          ? 'Вы демонстрируете солидную уверенность и четкую мотивацию в вашем подходе к продажам.'
          : null,
        weaknesses: score < 70
          ? 'Построение уверенности и прояснение ваших целей повысит вашу эффективность в продажах.'
          : null,
      },
      'Communication & Empathy': {
        strengths: score >= 70
          ? 'Вы превосходно понимаете клиентов и строите значимые связи.'
          : null,
        weaknesses: score < 70
          ? 'Развитие навыков активного слушания и эмпатии укрепит ваши отношения с клиентами.'
          : null,
      },
      'Adaptability & Problem-Solving': {
        strengths: score >= 70
          ? 'Вы хорошо адаптируетесь к изменениям и подходите к проблемам с креативными решениями.'
          : null,
        weaknesses: score < 70
          ? 'Повышение гибкости и навыков решения проблем поможет вам более эффективно преодолевать трудности.'
          : null,
      },
    },
  };

  return feedbacks[language][category] || { strengths: null, weaknesses: null };
};

const getCategoryName = (category, language) => {
  const names = {
    en: {
      'Emotional Fortitude': 'Emotional Fortitude',
      'Energy & Focus': 'Energy & Focus',
      'Confidence & Motivation': 'Confidence & Motivation',
      'Communication & Empathy': 'Communication & Empathy',
      'Adaptability & Problem-Solving': 'Adaptability & Problem-Solving',
    },
    ru: {
      'Emotional Fortitude': 'Эмоциональная устойчивость',
      'Energy & Focus': 'Энергия и фокус',
      'Confidence & Motivation': 'Уверенность и мотивация',
      'Communication & Empathy': 'Коммуникация и эмпатия',
      'Adaptability & Problem-Solving': 'Адаптивность и решение проблем',
    },
  };

  return names[language][category] || category;
};

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
  const { t, language } = useLanguage();

  if (!categoryScores) return null;

  const categories = Object.entries(categoryScores).map(([name, score]) => ({
    name,
    score: Math.round(score),
    feedback: getCategoryFeedback(name, Math.round(score), language),
  }));

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
            {language === 'ru' ? 'Результаты вашей оценки' : 'Your Assessment Results'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ru'
              ? 'Вот анализ ваших навыков по пяти ключевым категориям'
              : 'Here is your skills analysis across five key categories'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Card className="border-2 border-[#6495ED]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold">
                  {language === 'ru' ? 'Общий балл' : 'Overall Score'}
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
              {language === 'ru' ? 'Ваши сильные стороны' : 'Your Strengths'}
            </h3>
            {strengths.length > 0 ? (
              <div className="space-y-3">
                {strengths.map((category) => (
                  <Card key={category.name} className="bg-green-50">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">
                          {getCategoryName(category.name, language)}
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
                {language === 'ru'
                  ? 'Продолжайте работать над всеми категориями для достижения оптимальных результатов.'
                  : 'Continue working on all categories to achieve optimal results.'}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              {language === 'ru' ? 'Области для развития' : 'Areas for Development'}
            </h3>
            {areasForDevelopment.length > 0 ? (
              <div className="space-y-3">
                {areasForDevelopment.map((category) => (
                  <Card key={category.name} className="bg-yellow-50">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">
                          {getCategoryName(category.name, language)}
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
                {language === 'ru'
                  ? 'Отличная работа! Все ваши навыки на высоком уровне.'
                  : 'Great job! All your skills are at a high level.'}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              {language === 'ru' ? 'Все категории' : 'All Categories'}
            </h3>
            <div className="space-y-3">
              {sortedCategories.map((category) => (
                <Card key={category.name}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {getCategoryName(category.name, language)}
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
              {language === 'ru' ? 'Начать тренировку' : 'Start Training'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
