'use client';

interface DailyStatusBadgeProps {
  canGenerate: boolean;
  remaining: number;
  maxGenerations: number;
}

export default function DailyStatusBadge({
  canGenerate,
  remaining,
  maxGenerations,
}: DailyStatusBadgeProps) {
  return (
    <div
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full
        ${canGenerate
          ? 'bg-emerald-500/10 border border-emerald-500/20'
          : 'bg-amber-500/10 border border-amber-500/20'
        }
      `}
    >
      {/* Status dot */}
      <div className="relative">
        <div
          className={`
            w-2.5 h-2.5 rounded-full
            ${canGenerate ? 'bg-emerald-400' : 'bg-amber-400'}
          `}
        />
        {canGenerate && (
          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
        )}
      </div>

      {/* Status text */}
      <span
        className={`
          text-sm font-medium
          ${canGenerate ? 'text-emerald-400' : 'text-amber-400'}
        `}
      >
        {canGenerate ? (
          remaining === maxGenerations ? (
            "Today's wallpaper is ready"
          ) : (
            `${remaining} of ${maxGenerations} remaining`
          )
        ) : (
          'Come back tomorrow'
        )}
      </span>
    </div>
  );
}
