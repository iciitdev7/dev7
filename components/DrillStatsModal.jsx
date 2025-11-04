'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, TrendingUp, Calendar, Award, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Drills that should show the text area
const DRILLS_WITH_TEXTAREA = [
  'abc-card',
  'three-kind-facts',
  'roleplay-dialogue',
  'summary-30',
  'emotional-labeling',
  'three-alternatives',
  'what-if-scenarios',
  'perspective-reframe',
  'micro-exposure',
  'one-outcome-three-actions',
  'sixty-second-retro'
];

export default function DrillStatsModal({ drillId, drillName, onClose, completionHistory = [] }) {
  const { t } = useLanguage();
  const [notes, setNotes] = useState('');
  const showTextarea = DRILLS_WITH_TEXTAREA.includes(drillId);

  // Prepare chart data - last 7 completions
  const chartData = completionHistory.slice(-7).map((item, index) => ({
    label: item.date || `Day ${index + 1}`,
    value: item.score || 100,
    date: item.completedAt
  }));

  // Calculate stats
  const totalCompletions = completionHistory.length;
  const averageScore = completionHistory.length > 0
    ? Math.round(completionHistory.reduce((sum, item) => sum + (item.score || 100), 0) / completionHistory.length)
    : 0;
  const lastCompletion = completionHistory.length > 0
    ? new Date(completionHistory[completionHistory.length - 1].completedAt).toLocaleDateString()
    : 'N/A';

  // Calculate max value for chart scaling
  const maxValue = Math.max(...chartData.map(d => d.value), 100);
  const chartHeight = 200;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-[#6495ED]/10 to-blue-100/50 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">{t('drillStats.congratulations')}</CardTitle>
              <p className="text-gray-600 mt-1">{t('drillStats.completed', { drill: drillName })}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <TrendingUp className="h-6 w-6 text-[#6495ED] mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{totalCompletions}</div>
              <div className="text-sm text-gray-600">{t('drillStats.totalCompletions')}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Award className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{averageScore}%</div>
              <div className="text-sm text-gray-600">{t('drillStats.averageScore')}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{totalCompletions}</div>
              <div className="text-sm text-gray-600">{t('drillStats.timesCompleted')}</div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('drillStats.progressOverTime')}</h3>

            {chartData.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-end justify-between gap-2" style={{ height: chartHeight }}>
                  {chartData.map((data, index) => {
                    const barHeight = (data.value / maxValue) * chartHeight;
                    const date = data.date ? new Date(data.date) : null;
                    const formattedDate = date ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `#${index + 1}`;

                    return (
                      <div key={index} className="flex-1 flex flex-col items-center justify-end" style={{ height: chartHeight }}>
                        <div className="relative group">
                          <div
                            className="w-full bg-gradient-to-t from-[#6495ED] to-blue-400 rounded-t-lg transition-all duration-300 hover:opacity-80 min-w-[40px]"
                            style={{ height: `${barHeight}px` }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                              {data.value}%
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-2 text-center">
                          {formattedDate}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Y-axis labels */}
                <div className="flex justify-between text-xs text-gray-500 mt-2 border-t pt-2">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t('drillStats.noDataYet')}
              </div>
            )}
          </div>

          {/* Text Area for specific drills */}
          {showTextarea && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{t('drillStats.keepGoing')}</h3>
                  <p className="text-sm text-gray-700 mb-4">{t('drillStats.notesPrompt')}</p>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('drillStats.notesPlaceholder')}
                    className="min-h-[120px] max-h-[200px] resize-y"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-2 text-right">
                    {notes.length} / 500 {t('drillStats.characters')}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-700 italic">
                  "{t('drillStats.encouragement')}"
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {t('drillStats.keepPracticing')}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-[#6495ED] to-blue-600 hover:from-blue-600 hover:to-[#6495ED] text-white px-8"
              size="lg"
            >
              {t('drillStats.continue')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
