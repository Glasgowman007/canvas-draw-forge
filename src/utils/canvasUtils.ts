
import { v4 as uuidv4 } from 'uuid';
import { fabric } from 'fabric';
import { Asset } from '../types';

// Function to convert canvas to JPEG data URL
export const canvasToJpeg = (canvas: fabric.Canvas): string => {
  return canvas.toDataURL({ 
    format: 'jpeg',
    quality: 0.8,
    multiplier: 1
  });
};

// Function to save canvas as JPEG
export const saveCanvasAsJpeg = (canvas: fabric.Canvas, fileName: string = 'canvas-drawing'): void => {
  const dataUrl = canvasToJpeg(canvas);
  
  // Create a temporary anchor element
  const link = document.createElement('a');
  link.download = `${fileName}.jpg`;
  link.href = dataUrl;
  
  // Programmatically click the link to trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to convert a file to data URL
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to convert file to data URL'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Function to create an asset from a file
export const createAssetFromFile = async (file: File): Promise<Asset> => {
  try {
    const src = await fileToDataUrl(file);
    return {
      id: uuidv4(),
      name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension from name
      src,
      type: 'image'
    };
  } catch (error) {
    console.error('Error creating asset from file:', error);
    throw error;
  }
};

// Default assets data
export const defaultAssets: Asset[] = [
  { 
    id: '1', 
    name: 'Single Light Switch', 
    src: '/lovable-uploads/ee89338f-96ec-4daf-bbda-e8a8124849a9.png',
    type: 'image' 
  },
  { 
    id: '2', 
    name: 'Double Light Switch', 
    src: '/lovable-uploads/f9a9e09f-e678-4171-b4e3-6cf9cd8da99b.png',
    type: 'image' 
  },
  { 
    id: '3', 
    name: 'Socket Outlet', 
    src: '/lovable-uploads/fde4ca78-b0f9-4198-a2e3-efe99caf4cb8.png',
    type: 'image' 
  },
  { 
    id: '4', 
    name: 'Light Switch Box', 
    src: '/lovable-uploads/d7d2d94b-3d15-4a31-84ae-40a31a552294.png',
    type: 'image' 
  },
  { 
    id: '5', 
    name: 'Socket Box', 
    src: '/lovable-uploads/bff0fc59-be40-43d4-9ae6-0443e7a396da.png',
    type: 'image' 
  },
  { 
    id: '6', 
    name: 'Two Way Switch Box', 
    src: '/lovable-uploads/cd1c5a33-e3f6-41b5-946d-27a13c1e3a38.png',
    type: 'image' 
  },
  {
    id: '7',
    name: 'Consumer Unit',
    src: '/lovable-uploads/e0264135-eec0-47ef-9d36-482f0edac1f0.png',
    type: 'image'
  },
  {
    id: '8',
    name: 'Two Way Connection',
    src: '/lovable-uploads/579549a5-8186-417c-9783-cfdf497ccbf9.png',
    type: 'image'
  }
];
