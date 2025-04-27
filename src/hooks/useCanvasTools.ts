
import { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Tool } from '@/types';

export const useCanvasTools = (
  fabricCanvas: FabricCanvas | null, 
  activeTool: Tool
) => {
  useEffect(() => {
    if (!fabricCanvas) return;
    
    switch (activeTool) {
      case 'select':
        fabricCanvas.selection = true;
        fabricCanvas.defaultCursor = 'default';
        fabricCanvas.hoverCursor = 'move';
        fabricCanvas.getObjects().forEach((obj) => {
          obj.selectable = true;
          obj.evented = true;
        });
        break;
      case 'line':
        fabricCanvas.selection = false;
        fabricCanvas.defaultCursor = 'crosshair';
        fabricCanvas.getObjects().forEach((obj) => {
          obj.selectable = false;
          obj.evented = false;
        });
        break;
      case 'move':
      case 'zoom-in':
      case 'zoom-out':
        fabricCanvas.selection = false;
        fabricCanvas.defaultCursor = 'default';
        fabricCanvas.getObjects().forEach((obj) => {
          obj.selectable = false;
          obj.evented = false;
        });
        break;
    }
    
    fabricCanvas.renderAll();
  }, [activeTool, fabricCanvas]);
};
