'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';

export default function DefaultDrill({ drill, onComplete }) {
  return (
    <Card className="border-dashed border-2 border-gray-200">
      <CardContent className="p-8 text-center">
        <PlayCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{drill.title}</h3>
        <p className="text-gray-600 mb-4">{drill.description}</p>
        <Button 
          onClick={() => onComplete(drill.id, { simulated: true })}
          className="bg-gradient-to-r from-[#6495ED] to-blue-600"
        >
          Complete Exercise (Demo)
        </Button>
      </CardContent>
    </Card>
  );
}