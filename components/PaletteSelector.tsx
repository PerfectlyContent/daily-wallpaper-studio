'use client';

import { ColorPalette } from '../types';

interface PaletteSelectorProps {
  palettes: ColorPalette[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function PaletteSelector({
  palettes,
  selectedId,
  onSelect,
}: PaletteSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-bone-muted text-sm uppercase tracking-wider">
        Color Palette
      </label>

      <div className="grid grid-cols-1 gap-3">
        {palettes.map((palette) => (
          <button
            key={palette.id}
            onClick={() => onSelect(palette.id)}
            className={`
              relative p-4 rounded-2xl transition-all duration-200
              ${selectedId === palette.id
                ? 'bg-background-tertiary ring-1 ring-bone/30'
                : 'bg-background-secondary hover:bg-background-tertiary'
              }
            `}
          >
            <div className="flex items-center gap-4">
              {/* Color swatches */}
              <div className="flex -space-x-2">
                {palette.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-background-secondary shadow-md"
                    style={{ backgroundColor: color, zIndex: palette.colors.length - index }}
                  />
                ))}
              </div>

              {/* Palette info */}
              <div className="flex-1 text-left">
                <h4 className="text-bone font-medium">{palette.name}</h4>
                <p className="text-bone-dark text-sm">{palette.description}</p>
              </div>

              {/* Selected indicator */}
              {selectedId === palette.id && (
                <div className="w-5 h-5 rounded-full bg-bone flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-background"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
