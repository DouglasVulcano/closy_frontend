import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#8b7cf8', '#a78bfa', '#c4b5fd', '#ddd6fe',
  '#7dd3fc', '#67e8f9', '#5eead4', '#6ee7b7',
  '#fde047', '#facc15', '#fb923c', '#f97316',
  '#fb7185', '#f43f5e', '#ef4444', '#dc2626',
  '#6b7280', '#4b5563', '#374151', '#1f2937',
  '#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb',
];

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(color);

  const handleColorChange = (newColor: string) => {
    setInputValue(newColor);
    onChange(newColor);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value.match(/^#[0-9A-F]{6}$/i)) {
      onChange(value);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-10 p-2 justify-start gap-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div 
            className="w-6 h-6 rounded border border-border shadow-sm"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-mono">{color}</span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          {/* Color Input */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Código da cor
            </label>
            <Input
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="#000000"
              className="h-8 text-sm font-mono"
            />
          </div>

          {/* Preset Colors */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Cores pré-definidas
            </label>
            <div className="grid grid-cols-8 gap-1">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  className={`
                    w-6 h-6 rounded border-2 transition-all hover:scale-110
                    ${color === presetColor 
                      ? 'border-ring shadow-md' 
                      : 'border-border hover:border-muted-foreground'
                    }
                  `}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handleColorChange(presetColor)}
                />
              ))}
            </div>
          </div>

          {/* Native Color Picker */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Selecionador de cor
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-10 rounded border border-border cursor-pointer"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};