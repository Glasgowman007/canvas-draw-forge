
import { useEffect } from 'react';
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
import { Asset } from '@/types';
import { toast } from 'sonner';

export const useCanvasAssets = (
  fabricCanvas: FabricCanvas | null,
  draggedAsset: Asset | null
) => {
  useEffect(() => {
    if (!fabricCanvas || !draggedAsset) return;
    
    const url = draggedAsset.src;
    
    FabricImage.fromURL(url, {})
      .then(img => {
        if (img.width && img.height) {
          const maxSize = 100;
          if (img.width > maxSize || img.height > maxSize) {
            const scale = Math.min(maxSize / img.width, maxSize / img.height);
            img.scale(scale);
          }
        }
        
        img.set({
          left: fabricCanvas.width! / 2,
          top: fabricCanvas.height! / 2,
          cornerSize: 10,
          hasControls: true,
          hasBorders: true,
          name: draggedAsset.name
        });
        
        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);
        fabricCanvas.renderAll();
        
        toast.success(`Added ${draggedAsset.name} to canvas`);
      })
      .catch(() => {
        console.error('Error loading image:', draggedAsset.src);
        toast.error(`Failed to load ${draggedAsset.name}`);
      });
  }, [draggedAsset, fabricCanvas]);
};
