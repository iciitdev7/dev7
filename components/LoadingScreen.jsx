'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-[#6495ED]/10 flex items-center justify-center">
      <Card className="max-w-md mx-4 border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#6495ED] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">SalesMind</h2>
          <p className="text-gray-600 mb-6">Loading your personalized experience...</p>
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#6495ED]" />
            <span className="text-sm text-gray-500">Initializing data...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}