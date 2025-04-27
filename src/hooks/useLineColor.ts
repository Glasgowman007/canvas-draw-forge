
import { LineColor } from '@/types';

const colorMap: Record<LineColor, string> = {
  'brown': 'var(--drawing-brown)',
  'black': 'var(--drawing-black)',
  'green': 'var(--drawing-green)',
};

export const useLineColor = (activeColor: LineColor) => {
  return {
    getLineColor: () => colorMap[activeColor]
  };
};
