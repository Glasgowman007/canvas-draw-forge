
import { Canvas as FabricCanvas, Line as FabricLine } from 'fabric';
import { LinePoint, LineColor } from '@/types';

export const useLineCreation = (fabricCanvas: FabricCanvas | null, activeColor: LineColor) => {
  const createTemporaryLine = (startPoint: LinePoint, endPoint: LinePoint) => {
    if (!fabricCanvas) return;
    
    const objects = fabricCanvas.getObjects();
    const tempLine = objects.find((obj: any) => obj.data?.isTemp);
    if (tempLine) {
      fabricCanvas.remove(tempLine);
    }
    
    const line = new FabricLine(
      [startPoint.x, startPoint.y, endPoint.x, endPoint.y],
      {
        stroke: `var(--drawing-${activeColor})`,
        strokeWidth: 2,
        selectable: false,
        evented: false,
        data: { isTemp: true }
      }
    );
    
    fabricCanvas.add(line);
    fabricCanvas.renderAll();
  };

  const createFinalLine = (startPoint: LinePoint, endPoint: LinePoint) => {
    if (!fabricCanvas) return;
    
    const objects = fabricCanvas.getObjects();
    const tempLine = objects.find((obj: any) => obj.data?.isTemp);
    if (tempLine) {
      fabricCanvas.remove(tempLine);
    }
    
    const line = new FabricLine(
      [startPoint.x, startPoint.y, endPoint.x, endPoint.y],
      {
        stroke: `var(--drawing-${activeColor})`,
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
        hasBorders: true
      }
    );
    
    fabricCanvas.add(line);
    fabricCanvas.renderAll();
  };

  return {
    createTemporaryLine,
    createFinalLine
  };
};
