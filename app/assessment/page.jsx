'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Brain } from 'lucide-react';
import { mockAssessmentQuestions, mockSkills } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import LanguageToggle from '../../components/LanguageToggle';
import AuthGuard from '../../components/AuthGuard';
import AssessmentResultsModal from '../../components/AssessmentResultsModal';
import { supabase } from '../../lib/supabase';


export default function AssessmentPage() {
  const router = useRouter();
  const { dispatch } = useApp();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [categoryScores, setCategoryScores] = useState(null);

  const currentQuestion = mockAssessmentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / mockAssessmentQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === mockAssessmentQuestions.length - 1;

  const handleAnswerSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === '') return;

    // Save answer
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        skill: currentQuestion.skill,
        selectedOption: selectedOption,
        score: currentQuestion.scoreValues[selectedOption]
      }
    };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // Calculate skill scores and complete assessment
      completeAssessment(newAnswers);
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption('');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevAnswer = answers[mockAssessmentQuestions[currentQuestionIndex - 1].id];
      setSelectedOption(prevAnswer ? prevAnswer.selectedOption : '');
    }
  };

  const completeAssessment = async (finalAnswers) => {
    setIsSubmitting(true);

    // Calculate average scores for each category
    const categoryScoresMap = {};

    // Group answers by category
    Object.values(finalAnswers).forEach(answer => {
      const question = mockAssessmentQuestions.find(q => q.id === answer.questionId);
      const category = question?.category || question?.skill;

      if (!categoryScoresMap[category]) {
        categoryScoresMap[category] = [];
      }
      categoryScoresMap[category].push(answer.score);
    });

    // Calculate averages and convert to 0-10 scale
    const averageScores = {};
    Object.keys(categoryScoresMap).forEach(category => {
      const scores = categoryScoresMap[category];
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      averageScores[category] = Math.round((avg / 100) * 10 * 10) / 10;
    });

    setCategoryScores(averageScores);

    // Save to Supabase if user is authenticated
    if (user) {
      try {
        const { error } = await supabase
          .from('assessment_results')
          .insert({
            user_id: user.id,
            categories: averageScores,
            answers: finalAnswers,
            completed_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Error saving assessment:', error);
        }
      } catch (err) {
        console.error('Error saving assessment:', err);
      }
    }

    // Update mock skills with calculated scores for backward compatibility
    const updatedSkills = mockSkills.map(skill => ({
      ...skill,
      score: Math.round((averageScores[skill.shortName] || 5) * 10)
    }));

    // Dispatch to context
    dispatch({
      type: 'COMPLETE_ASSESSMENT',
      payload: {
        answers: finalAnswers,
        calculatedSkills: updatedSkills,
        categoryScores: averageScores
      }
    });

    setIsSubmitting(false);
    setShowResultsModal(true);
  };

  const handleModalClose = () => {
    setShowResultsModal(false);
    router.push('/dashboard');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-[#6495ED]/10">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-[#6495ED]" />
              <span className="text-xl font-bold text-gray-900">{t('assessmentTitle')}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-[#6495ED]/10 text-[#6495ED]">
                {t('questionOf', { current: currentQuestionIndex + 1, total: mockAssessmentQuestions.length })}
              </Badge>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">{t('progressLabel')}</span>
              <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="shadow-xl border-0 mb-8">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-gradient-to-r from-[#6495ED] to-blue-600 text-white">
                  {currentQuestion.skill}
                </Badge>
              </div>
              <CardTitle className="text-2xl leading-relaxed text-gray-900">
                {t(currentQuestion.textKey)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {t(currentQuestion.optionsKey).map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedOption === index
                        ? 'border-[#6495ED] bg-[#6495ED]/5 text-[#6495ED] font-medium'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        selectedOption === index
                          ? 'border-[#6495ED] bg-[#6495ED]'
                          : 'border-gray-300'
                      }`}>
                        {selectedOption === index && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                        )}
                      </div>
                      <span className="text-base">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t('previous')}</span>
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={selectedOption === '' || isSubmitting}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white px-6"
            >
              <span>
                {isSubmitting ? 'Saving...' : isLastQuestion ? t('completeAssessment') : t('next')}
              </span>
              {!isLastQuestion && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <AssessmentResultsModal
      isOpen={showResultsModal}
      onClose={handleModalClose}
      categoryScores={categoryScores}
    />
    </AuthGuard>
  );
}