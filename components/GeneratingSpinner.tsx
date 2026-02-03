'use client';

import { useState, useEffect } from 'react';

interface GeneratingSpinnerProps {
  styleUniverse: string;
  vibe: string;
  timeOfDay: string;
}

const loadingMessages = [
  'Mixing colors...',
  'Arranging shapes...',
  'Adding atmosphere...',
  'Perfecting details...',
  'Almost there...',
];

export default function GeneratingSpinner({
  styleUniverse,
  vibe,
  timeOfDay,
}: GeneratingSpinnerProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      {/* Main spinner */}
      <div className="relative mb-8">
        {/* Outer ring */}
        <div className="w-24 h-24 rounded-full border-2 border-bone/10" />

        {/* Spinning gradient ring */}
        <div
          className="absolute inset-0 rounded-full animate-spin-slow"
          style={{
            background: 'conic-gradient(from 0deg, transparent, #f5f0eb, transparent)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))',
          }}
        />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl animate-pulse">✨</span>
        </div>
      </div>

      {/* Main message */}
      <h3 className="font-serif text-2xl text-bone mb-3">
        Crafting your wallpaper
      </h3>

      {/* Style combination */}
      <p className="text-bone-muted text-sm mb-6">
        Blending{' '}
        <span className="text-bone">{styleUniverse.toLowerCase()}</span>
        {' × '}
        <span className="text-bone">{vibe.toLowerCase()}</span>
        {' × '}
        <span className="text-bone">{timeOfDay.toLowerCase()}</span>
      </p>

      {/* Rotating sub-messages */}
      <div className="h-6 overflow-hidden">
        <p
          key={messageIndex}
          className="text-bone-dark text-sm animate-slide-up"
        >
          {loadingMessages[messageIndex]}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${i <= messageIndex ? 'bg-bone' : 'bg-bone/20'}
            `}
            style={{
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
