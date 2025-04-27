
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

export type Tool = 
  | 'select'
  | 'line'
  | 'move'
  | 'zoom-in'
  | 'zoom-out';

export type LineColor = 'brown' | 'black' | 'green';

export interface Asset {
  id: string;
  name: string;
  src: string;
  type: 'image';
}

export interface LinePoint {
  x: number;
  y: number;
}

export type CanvasObject = FabricObject;
