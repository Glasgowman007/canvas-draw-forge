
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Pencil, 
  Eraser, 
  Move, 
  ZoomIn, 
  ZoomOut, 
  Save, 
  Trash2
} from 'lucide-react';
import { Tool } from '@/types';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onSave: () => void;
  onClear: () => void;
  onDeleteSelected: () => void;
  hasSelectedObject: boolean;
}

interface ToolButtonProps {
  tool: Tool;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  tool,
  icon,
  label,
  active,
  onClick,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={active ? "default" : "outline"}
          size="icon"
          className={cn(
            "h-9 w-9",
            active && "bg-primary text-primary-foreground"
          )}
          onClick={onClick}
          aria-label={label}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
};

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onToolChange,
  onSave,
  onClear,
  onDeleteSelected,
  hasSelectedObject,
}) => {
  return (
    <div className="flex flex-wrap gap-2 p-2 bg-background border border-border rounded-md shadow-sm">
      <ToolButton
        tool="select"
        icon={<Move size={16} />}
        label="Select & Move"
        active={activeTool === "select"}
        onClick={() => onToolChange("select")}
      />
      <ToolButton
        tool="line"
        icon={<Pencil size={16} />}
        label="Draw Line"
        active={activeTool === "line"}
        onClick={() => onToolChange("line")}
      />
      <ToolButton
        tool="zoom-in"
        icon={<ZoomIn size={16} />}
        label="Zoom In"
        active={activeTool === "zoom-in"}
        onClick={() => onToolChange("zoom-in")}
      />
      <ToolButton
        tool="zoom-out"
        icon={<ZoomOut size={16} />}
        label="Zoom Out"
        active={activeTool === "zoom-out"}
        onClick={() => onToolChange("zoom-out")}
      />
      <div className="w-px h-9 bg-border mx-1"></div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9" 
            onClick={onDeleteSelected} 
            disabled={!hasSelectedObject}
            aria-label="Delete Selected"
          >
            <Trash2 size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Delete Selected</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9" 
            onClick={onClear}
            aria-label="Clear Canvas"
          >
            <Eraser size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Clear Canvas</TooltipContent>
      </Tooltip>
      <div className="w-px h-9 bg-border mx-1"></div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9" 
            onClick={onSave}
            aria-label="Save as JPEG"
          >
            <Save size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Save as JPEG</TooltipContent>
      </Tooltip>
    </div>
  );
};
