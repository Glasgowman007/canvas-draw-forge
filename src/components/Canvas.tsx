
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, fabric } from 'fabric';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Asset, CanvasObject, LineColor, LinePoint, Tool } from '@/types';
import { saveCanvasAsJpeg } from '@/utils/canvasUtils';
import { toast } from 'sonner';

interface CanvasProps {
  activeTool: Tool;
  activeColor: LineColor;
  draggedAsset: Asset | null;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  activeTool, 
  activeColor,
  draggedAsset 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<LinePoint | null>(null);
  const [selectedObject, setSelectedObject] = useState<CanvasObject | null>(null);
  
  // Color mapping
  const colorMap: Record<LineColor, string> = {
    'brown': 'var(--drawing-brown)',
    'black': 'var(--drawing-black)',
    'green': 'var(--drawing-green)',
  };

  // Initialize the Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: 1200,
      height: 800,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    fabricCanvas.selection = true;

    fabricCanvasRef.current = fabricCanvas;

    // Handle object selection
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

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Handle tool changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    switch (activeTool) {
      case 'select':
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
        canvas.getObjects().forEach(obj => {
          obj.selectable = true;
          obj.evented = true;
        });
        break;
      case 'line':
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
        canvas.getObjects().forEach(obj => {
          obj.selectable = false;
          obj.evented = false;
        });
        break;
      case 'move':
      case 'zoom-in':
      case 'zoom-out':
        canvas.selection = false;
        canvas.defaultCursor = 'default';
        canvas.getObjects().forEach(obj => {
          obj.selectable = false;
          obj.evented = false;
        });
        break;
      default:
        break;
    }
    
    canvas.renderAll();
  }, [activeTool]);

  // Handle asset drag and drop
  useEffect(() => {
    if (!fabricCanvasRef.current || !draggedAsset) return;
    
    const canvas = fabricCanvasRef.current;
    
    fabric.Image.fromURL(draggedAsset.src, (img) => {
      // Scale down large images
      if (img.width && img.height) {
        const maxSize = 100;
        if (img.width > maxSize || img.height > maxSize) {
          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          img.scale(scale);
        }
      }
      
      // Position the image in the center of the canvas
      img.set({
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        cornerSize: 10,
        hasControls: true,
        hasBorders: true,
        name: draggedAsset.name
      });
      
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      
      toast.success(`Added ${draggedAsset.name} to canvas`);
    });
  }, [draggedAsset]);

  // Mouse event handlers for line drawing
  const handleMouseDown = (event: fabric.IEvent) => {
    if (activeTool !== 'line' || isDrawing || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(event.e);
    
    setIsDrawing(true);
    setStartPoint({ x: pointer.x, y: pointer.y });
  };

  const handleMouseMove = (event: fabric.IEvent) => {
    if (!isDrawing || !startPoint || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(event.e);
    
    // If there's an existing temporary line, remove it
    const objects = canvas.getObjects();
    const tempLine = objects.find(obj => obj.data?.isTemp);
    if (tempLine) {
      canvas.remove(tempLine);
    }
    
    // Draw a new temporary line
    const line = new fabric.Line(
      [startPoint.x, startPoint.y, pointer.x, pointer.y],
      {
        stroke: colorMap[activeColor],
        strokeWidth: 2,
        selectable: false,
        evented: false,
        data: { isTemp: true }
      }
    );
    
    canvas.add(line);
    canvas.renderAll();
  };

  const handleMouseUp = (event: fabric.IEvent) => {
    if (!isDrawing || !startPoint || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(event.e);
    
    // Remove any temporary line
    const objects = canvas.getObjects();
    const tempLine = objects.find(obj => obj.data?.isTemp);
    if (tempLine) {
      canvas.remove(tempLine);
    }
    
    // Create the final line
    const line = new fabric.Line(
      [startPoint.x, startPoint.y, pointer.x, pointer.y],
      {
        stroke: colorMap[activeColor],
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
        hasBorders: true
      }
    );
    
    canvas.add(line);
    canvas.renderAll();
    
    setIsDrawing(false);
    setStartPoint(null);
  };

  // Mouse event handlers for canvas zoom
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
  }, [isDrawing, startPoint, activeTool, activeColor]);

  // Handle drop events
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // The actual asset handling is done in the draggedAsset effect
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Allow drop
  };

  // Public methods for external components
  const saveCanvas = () => {
    if (!fabricCanvasRef.current) return;
    saveCanvasAsJpeg(fabricCanvasRef.current, 'canvas-drawing');
    toast.success("Drawing saved as JPEG");
  };

  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.clear();
    fabricCanvasRef.current.setBackgroundColor('#ffffff', () => {});
    fabricCanvasRef.current.renderAll();
    toast.success("Canvas cleared");
  };

  const deleteSelectedObject = () => {
    if (!fabricCanvasRef.current || !selectedObject) return;
    fabricCanvasRef.current.remove(selectedObject);
    fabricCanvasRef.current.renderAll();
    setSelectedObject(null);
    toast.success("Object deleted");
  };
  
  // Export public methods
  React.useImperativeHandle(
    React.forwardRef((_, ref) => ref),
    () => ({
      saveCanvas,
      clearCanvas,
      deleteSelectedObject,
      hasSelectedObject: !!selectedObject
    })
  );

  return (
    <div 
      className="flex-1 overflow-hidden bg-gray-50 h-full border border-border"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      ref={wrapperRef}
    >
      <TransformWrapper
        initialScale={1}
        disabled={activeTool !== 'zoom-in' && activeTool !== 'zoom-out'}
        minScale={0.1}
        maxScale={5}
        wheel={{ step: 0.1 }}
        zoomIn={{ step: 0.2 }}
        zoomOut={{ step: 0.2 }}
      >
        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100%' }}
          contentStyle={{ width: '100%', height: '100%' }}
        >
          <canvas ref={canvasRef} />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};
