
import { v4 as uuidv4 } from 'uuid';
import { Canvas } from 'fabric';
import { Asset } from '../types';

// Function to convert canvas to JPEG data URL
export const canvasToJpeg = (canvas: Canvas): string => {
  return canvas.toDataURL({ 
    format: 'jpeg', 
    quality: 0.8 
  });
};

// Function to save canvas as JPEG
export const saveCanvasAsJpeg = (canvas: Canvas, fileName: string = 'canvas-drawing'): void => {
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
    name: 'Two Way Switch', 
    src: '/lovable-uploads/0a6637b3-c9d8-469d-8135-923e8c199d2f.png',
    type: 'image' 
  },
  { 
    id: '2', 
    name: 'Socket Outlet', 
    src: '/placeholder.svg', 
    type: 'image' 
  },
  { 
    id: '3', 
    name: 'Light', 
    src: '/placeholder.svg', 
    type: 'image' 
  },
  { 
    id: '4', 
    name: 'Consumer Unit', 
    src: '/placeholder.svg', 
    type: 'image' 
  }
];
