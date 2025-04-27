
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { LineColor } from '@/types';
import { useDrawingState } from './useDrawingState';
import { useLineCreation } from './useLineCreation';

export const useCanvasDrawing = (fabricCanvas: FabricCanvas | null, activeColor: LineColor) => {
  const { isDrawing, setIsDrawing, startPoint, setStartPoint } = useDrawingState();
  const { createTemporaryLine, createFinalLine } = useLineCreation(fabricCanvas, activeColor);

  const handleMouseDown = useCallback((event: any) => {
    if (!fabricCanvas) return;
    
    const pointer = fabricCanvas.getPointer(event.e);
    setIsDrawing(true);
    setStartPoint({ x: pointer.x, y: pointer.y });
  }, [fabricCanvas, setIsDrawing, setStartPoint]);

  const handleMouseMove = useCallback((event: any) => {
    if (!isDrawing || !startPoint || !fabricCanvas) return;
    
    const pointer = fabricCanvas.getPointer(event.e);
    createTemporaryLine(startPoint, { x: pointer.x, y: pointer.y });
  }, [isDrawing, startPoint, fabricCanvas, createTemporaryLine]);

  const handleMouseUp = useCallback((event: any) => {
    if (!isDrawing || !startPoint || !fabricCanvas) return;
    
    const pointer = fabricCanvas.getPointer(event.e);
    createFinalLine(startPoint, { x: pointer.x, y: pointer.y });
    
    setIsDrawing(false);
    setStartPoint(null);
  }, [isDrawing, startPoint, fabricCanvas, createFinalLine, setIsDrawing, setStartPoint]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDrawing
  };
};
