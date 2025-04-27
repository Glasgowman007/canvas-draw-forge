
import React, { useState } from 'react';
import { Asset } from '@/types';
import { AssetItem } from './AssetItem';
import { FileUpload } from './FileUpload';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { defaultAssets } from '@/utils/canvasUtils';
import { ColorPicker } from './ColorPicker';
import { LineColor } from '@/types';

interface SidebarProps {
  selectedColor: LineColor;
  onColorChange: (color: LineColor) => void;
  onDragStart: (asset: Asset) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  selectedColor, 
  onColorChange, 
  onDragStart 
}) => {
  const [assets, setAssets] = useState<Asset[]>(defaultAssets);

  const handleAssetAdd = (newAsset: Asset) => {
    setAssets((prev) => [newAsset, ...prev]);
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-border p-4 flex flex-col h-full">
      <h2 className="font-medium mb-2 text-sm">Components</h2>
      <FileUpload onAssetAdd={handleAssetAdd} />
      
      <ScrollArea className="flex-1 mt-4">
        <div className="grid grid-cols-2 gap-2 pr-4">
          {assets.map((asset) => (
            <AssetItem 
              key={asset.id} 
              asset={asset} 
              onDragStart={onDragStart} 
            />
          ))}
        </div>
      </ScrollArea>

      <Separator className="my-4" />
      
      <ColorPicker value={selectedColor} onChange={onColorChange} />
    </aside>
  );
};
