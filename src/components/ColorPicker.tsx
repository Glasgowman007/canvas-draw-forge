
import React from 'react';
import { cn } from '@/lib/utils';
import { LineColor } from '@/types';

interface ColorPickerProps {
  value: LineColor;
  onChange: (color: LineColor) => void;
}

const colors: { value: LineColor; label: string }[] = [
  { value: 'brown', label: 'Brown' },
  { value: 'black', label: 'Black' },
  { value: 'green', label: 'Green' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium">Line Color</span>
      <div className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            type="button"
            className={cn(
              "w-6 h-6 rounded-full transition-all",
              value === color.value && "ring-2 ring-offset-2 ring-primary"
            )}
            style={{ backgroundColor: `var(--drawing-${color.value})` }}
            aria-label={`Select ${color.label} color`}
            onClick={() => onChange(color.value)}
          />
        ))}
      </div>
    </div>
  );
};
