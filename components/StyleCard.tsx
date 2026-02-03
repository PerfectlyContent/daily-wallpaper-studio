'use client';

import { StyleUniverse } from '@/types';

interface StyleCardProps {
  universe: StyleUniverse;
  isSelected: boolean;
  onClick: () => void;
}

export default function StyleCard({ universe, isSelected, onClick }: StyleCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-full aspect-[4/5] rounded-3xl overflow-hidden
        transition-all duration-300 ease-out
        ${isSelected
          ? 'ring-2 ring-bone scale-[1.02] shadow-2xl'
          : 'hover:scale-[1.01] hover:shadow-xl'
        }
      `}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{ background: universe.previewGradient }}
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        {/* Icon */}
        <span className="text-4xl mb-3 drop-shadow-lg">{universe.icon}</span>

        {/* Name */}
        <h3 className="font-serif text-2xl text-bone mb-1">{universe.name}</h3>

        {/* Tagline */}
        <p className="text-bone-muted text-sm">{universe.tagline}</p>

        {/* Description (shows on hover/selection) */}
        <p
          className={`
            text-bone-dark text-xs mt-2 transition-opacity duration-300
            ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `}
        >
          {universe.description}
        </p>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 rounded-full bg-bone flex items-center justify-center">
            <svg
              className="w-4 h-4 text-background"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}
    </button>
  );
}
