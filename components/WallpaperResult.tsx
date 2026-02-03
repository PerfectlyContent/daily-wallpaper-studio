'use client';

import PhoneMockup from './PhoneMockup';

interface WallpaperResultProps {
  imageUrl: string;
  onDownload: () => void;
  onTryAgain: () => void;
  onSaveToHistory: () => void;
  isSaved?: boolean;
}

export default function WallpaperResult({
  imageUrl,
  onDownload,
  onTryAgain,
  onSaveToHistory,
  isSaved = false,
}: WallpaperResultProps) {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      {/* Success message */}
      <div className="text-center mb-8">
        <span className="text-4xl mb-4 block">🎉</span>
        <h2 className="font-serif text-3xl text-bone mb-2">
          Your wallpaper is ready
        </h2>
        <p className="text-bone-muted">
          Download it to your device or try a different style
        </p>
      </div>

      {/* Phone mockup with result */}
      <div className="mb-8">
        <PhoneMockup imageUrl={imageUrl} />
      </div>

      {/* Action buttons */}
      <div className="w-full max-w-xs space-y-3">
        {/* Primary: Download */}
        <button
          onClick={onDownload}
          className="
            w-full py-4 px-6 rounded-2xl
            bg-bone text-background
            font-medium text-lg
            flex items-center justify-center gap-3
            hover:bg-bone-muted transition-colors duration-200
            active:scale-[0.98]
          "
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download Wallpaper
        </button>

        {/* Secondary actions */}
        <div className="flex gap-3">
          {/* Save to history */}
          <button
            onClick={onSaveToHistory}
            disabled={isSaved}
            className={`
              flex-1 py-3 px-4 rounded-xl
              border border-bone/20
              font-medium text-sm
              flex items-center justify-center gap-2
              transition-all duration-200
              ${isSaved
                ? 'bg-background-tertiary text-bone-muted cursor-default'
                : 'text-bone hover:bg-background-tertiary active:scale-[0.98]'
              }
            `}
          >
            {isSaved ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Save
              </>
            )}
          </button>

          {/* Try again */}
          <button
            onClick={onTryAgain}
            className="
              flex-1 py-3 px-4 rounded-xl
              border border-bone/20 text-bone
              font-medium text-sm
              flex items-center justify-center gap-2
              hover:bg-background-tertiary transition-colors duration-200
              active:scale-[0.98]
            "
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
