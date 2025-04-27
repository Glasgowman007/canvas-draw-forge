
import { useState } from 'react';
import { LinePoint } from '@/types';

export const useDrawingState = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<LinePoint | null>(null);

  return {
    isDrawing,
    setIsDrawing,
    startPoint,
    setStartPoint
  };
};
