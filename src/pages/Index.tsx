
import React, { useRef, useState } from 'react';
import { Toolbar } from '@/components/Toolbar';
import { Sidebar } from '@/components/Sidebar';
import { Canvas, CanvasRef } from '@/components/Canvas';
import { Asset, LineColor, Tool } from '@/types';

const Index = () => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [activeColor, setActiveColor] = useState<LineColor>('black');
  const [draggedAsset, setDraggedAsset] = useState<Asset | null>(null);
  const canvasRef = useRef<CanvasRef>(null);

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
  };

  const handleColorChange = (color: LineColor) => {
    setActiveColor(color);
  };

  const handleAssetDragStart = (asset: Asset) => {
    setDraggedAsset(asset);
  };

  const handleSave = () => {
    canvasRef.current?.saveCanvas();
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleDeleteSelected = () => {
    canvasRef.current?.deleteSelectedObject();
  };

  const hasSelectedObject = !!canvasRef.current?.hasSelectedObject;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar 
        selectedColor={activeColor} 
        onColorChange={handleColorChange} 
        onDragStart={handleAssetDragStart} 
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="p-4 border-b border-border">
          <Toolbar 
            activeTool={activeTool}
            onToolChange={handleToolChange}
            onSave={handleSave}
            onClear={handleClear}
            onDeleteSelected={handleDeleteSelected}
            hasSelectedObject={hasSelectedObject}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <Canvas 
            ref={canvasRef}
            activeTool={activeTool}
            activeColor={activeColor}
            draggedAsset={draggedAsset}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
