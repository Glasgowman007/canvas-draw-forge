
import React from 'react';
import { Asset } from '@/types';

interface AssetItemProps {
  asset: Asset;
  onDragStart: (asset: Asset) => void;
}

export const AssetItem: React.FC<AssetItemProps> = ({ asset, onDragStart }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', asset.id);
    onDragStart(asset);
  };

  return (
    <div
      className="p-2 border border-border rounded-md hover:bg-muted transition cursor-grab bg-white"
      draggable
      onDragStart={handleDragStart}
      aria-label={`Drag ${asset.name}`}
    >
      <div className="h-12 w-full flex justify-center items-center mb-1">
        <img
          src={asset.src}
          alt={asset.name}
          className="object-contain max-h-12 max-w-full"
        />
      </div>
      <p className="text-xs text-center truncate">{asset.name}</p>
    </div>
  );
};
