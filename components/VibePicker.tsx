'use client';

import { Vibe } from '../types';
import { vibeOptions } from '../lib/style-data';

interface VibePickerProps {
  selected: Vibe | null;
  onSelect: (vibe: Vibe) => void;
}

export default function VibePicker({ selected, onSelect }: VibePickerProps) {
  return (
    <div className="space-y-4">
      <label className="block text-bone-muted text-sm uppercase tracking-wider">
        Vibe
      </label>

      <div className="flex flex-wrap gap-2">
        {vibeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`
              px-5 py-2.5 rounded-full transition-all duration-200
              text-sm font-medium
              ${selected === option.id
                ? 'bg-bone text-background'
                : 'bg-background-secondary text-bone-muted hover:bg-background-tertiary hover:text-bone'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
