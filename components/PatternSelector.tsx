'use client';

import { Pattern } from '@/types';

interface PatternSelectorProps {
  patterns: Pattern[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function PatternSelector({
  patterns,
  selectedId,
  onSelect,
}: PatternSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-bone-muted text-sm uppercase tracking-wider">
        Pattern Style
      </label>

      <div className="grid grid-cols-2 gap-3">
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            onClick={() => onSelect(pattern.id)}
            className={`
              relative p-4 rounded-2xl transition-all duration-200 text-left
              ${selectedId === pattern.id
                ? 'bg-background-tertiary ring-1 ring-bone/30'
                : 'bg-background-secondary hover:bg-background-tertiary'
              }
            `}
          >
            {/* Pattern name */}
            <h4 className="text-bone font-medium mb-1">{pattern.name}</h4>

            {/* Description */}
            <p className="text-bone-dark text-xs leading-relaxed">
              {pattern.description}
            </p>

            {/* Selected indicator */}
            {selectedId === pattern.id && (
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-bone flex items-center justify-center">
                <svg
                  className="w-2.5 h-2.5 text-background"
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
          </button>
        ))}
      </div>
    </div>
  );
}
