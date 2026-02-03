'use client';

import { TimeOfDay } from '@/types';
import { timeOfDayOptions } from '@/lib/style-data';

interface TimeOfDayPickerProps {
  selected: TimeOfDay | null;
  onSelect: (time: TimeOfDay) => void;
}

export default function TimeOfDayPicker({
  selected,
  onSelect,
}: TimeOfDayPickerProps) {
  return (
    <div className="space-y-4">
      <label className="block text-bone-muted text-sm uppercase tracking-wider">
        Time of Day
      </label>

      <div className="flex gap-2">
        {timeOfDayOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`
              flex-1 flex flex-col items-center justify-center
              py-4 px-3 rounded-2xl transition-all duration-200
              ${selected === option.id
                ? 'bg-background-tertiary ring-1 ring-bone/30'
                : 'bg-background-secondary hover:bg-background-tertiary'
              }
            `}
          >
            <span className="text-2xl mb-2">{option.emoji}</span>
            <span
              className={`
                text-sm font-medium
                ${selected === option.id ? 'text-bone' : 'text-bone-muted'}
              `}
            >
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
