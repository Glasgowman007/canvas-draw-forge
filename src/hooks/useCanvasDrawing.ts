
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Line as FabricLine } from 'fabric';
import { LinePoint, LineColor } from '@/types';

const colorMap: Record<LineColor, string> = {
  'brown': 'var(--drawing-brown)',
  'black': 'var(--drawing-black)',
  'green': 'var(--drawing-green)',
};

export const useCanvasDrawing = (fabricCanvas: FabricCanvas | null, activeColor: LineColor) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<LinePoint | null>(null);

  const handleMouseDown = useCallback((event: any) => {
    if (!fabricCanvas) return;
    
    const pointer = fabricCanvas.getPointer(event.e);
    setIsDrawing(true);
    setStartPoint({ x: pointer.x, y: pointer.y });
  }, [fabricCanvas]);

  const handleMouseMove = useCallback((event: any) => {
    if (!isDrawing || !startPoint || !fabricCanvas) return;
    
    const pointer = fabricCanvas.getPointer(event.e);
    
    const objects = fabricCanvas.getObjects();
    const tempLine = objects.find((obj: any) => obj.data?.isTemp);
    if (tempLine) {
      fabricCanvas.remove(tempLine);
    }
    
    const line = new FabricLine(
      [startPoint.x, startPoint.y, pointer.x, pointer.y],
      {
        stroke: colorMap[activeColor],
        strokeWidth: 2,
        selectable: false,
        evented: false,
        data: { isTemp: true }
      }
    );
    
    fabricCanvas.add(line);
    fabricCanvas.renderAll();
  }, [isDrawing, startPoint, fabricCanvas, activeColor]);

  const handleMouseUp = useCallback((event: any) => {
    if (!isDrawing || !startPoint || !fabricCanvas) return;
    
    const pointer = fabricCanvas.getPointer(event.e);
    
    const objects = fabricCanvas.getObjects();
    const tempLine = objects.find((obj: any) => obj.data?.isTemp);
    if (tempLine) {
      fabricCanvas.remove(tempLine);
    }
    
    const line = new FabricLine(
      [startPoint.x, startPoint.y, pointer.x, pointer.y],
      {
        stroke: colorMap[activeColor],
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
        hasBorders: true
      }
    );
    
    fabricCanvas.add(line);
    fabricCanvas.renderAll();
    
    setIsDrawing(false);
    setStartPoint(null);
  }, [isDrawing, startPoint, fabricCanvas, activeColor]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDrawing
  };
};
