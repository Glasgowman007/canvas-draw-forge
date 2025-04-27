
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Asset, Tool, LineColor } from '@/types';
import { saveCanvasAsJpeg } from '@/utils/canvasUtils';
import { toast } from 'sonner';
import { useCanvasInit } from '@/hooks/useCanvasInit';
import { useCanvasTools } from '@/hooks/useCanvasTools';
import { useCanvasDrawing } from '@/hooks/useCanvasDrawing';
import { useCanvasAssets } from '@/hooks/useCanvasAssets';

export interface CanvasRef {
  saveCanvas: () => void;
  clearCanvas: () => void;
  deleteSelectedObject: () => void;
  hasSelectedObject: boolean;
}

interface CanvasProps {
  activeTool: Tool;
  activeColor: LineColor;
  draggedAsset: Asset | null;
}

export const Canvas = forwardRef<CanvasRef, CanvasProps>(({ 
  activeTool, 
  activeColor,
  draggedAsset 
}, ref) => {
  const {
    canvasRef,
    fabricCanvasRef,
    selectedObject,
  } = useCanvasInit();

  useCanvasTools(fabricCanvasRef.current, activeTool);
  useCanvasAssets(fabricCanvasRef.current, draggedAsset);

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useCanvasDrawing(fabricCanvasRef.current, activeColor);

  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    
    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  const saveCanvas = () => {
    if (!fabricCanvasRef.current) return;
    saveCanvasAsJpeg(fabricCanvasRef.current, 'canvas-drawing');
    toast.success("Drawing saved as JPEG");
  };

  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.clear();
    fabricCanvasRef.current.backgroundColor = '#ffffff';
    fabricCanvasRef.current.renderAll();
    toast.success("Canvas cleared");
  };

  const deleteSelectedObject = () => {
    if (!fabricCanvasRef.current || !selectedObject) return;
    fabricCanvasRef.current.remove(selectedObject);
    fabricCanvasRef.current.renderAll();
    toast.success("Object deleted");
  };

  useImperativeHandle(ref, () => ({
    saveCanvas,
    clearCanvas,
    deleteSelectedObject,
    hasSelectedObject: !!selectedObject
  }));

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div 
      className="flex-1 overflow-hidden bg-gray-50 h-full border border-border"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="w-full h-full flex items-center justify-center">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas';
