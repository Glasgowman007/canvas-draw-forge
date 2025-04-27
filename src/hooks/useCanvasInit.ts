
import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { CanvasObject } from '@/types';

export const useCanvasInit = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<CanvasObject | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: 1200,
      height: 800,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    fabricCanvas.selection = true;

    fabricCanvas.on('selection:created', (e) => {
      if (e.selected && e.selected.length > 0) {
        setSelectedObject(e.selected[0]);
      }
    });

    fabricCanvas.on('selection:updated', (e) => {
      if (e.selected && e.selected.length > 0) {
        setSelectedObject(e.selected[0]);
      }
    });

    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    fabricCanvasRef.current = fabricCanvas;

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  return {
    canvasRef,
    fabricCanvasRef,
    selectedObject,
    setSelectedObject
  };
};
