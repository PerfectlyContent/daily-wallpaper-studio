'use client';

interface PhoneMockupProps {
  imageUrl?: string;
  isLoading?: boolean;
}

export default function PhoneMockup({ imageUrl, isLoading = false }: PhoneMockupProps) {
  return (
    <div className="relative mx-auto" style={{ width: '280px' }}>
      {/* Phone frame */}
      <div
        className="relative rounded-[3rem] bg-gradient-to-b from-zinc-800 to-zinc-900 p-3 shadow-2xl"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Inner bezel */}
        <div className="relative rounded-[2.5rem] bg-black overflow-hidden">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
            <div className="w-24 h-7 bg-black rounded-full" />
          </div>

          {/* Screen area */}
          <div
            className="relative bg-background-secondary overflow-hidden"
            style={{ aspectRatio: '9/19.5' }}
          >
            {isLoading ? (
              // Loading state
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Animated rings */}
                  <div className="absolute inset-0 animate-ping">
                    <div className="w-16 h-16 rounded-full border border-bone/20" />
                  </div>
                  <div className="w-16 h-16 rounded-full border-2 border-bone/30 animate-spin-slow" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-bone animate-pulse" />
                  </div>
                </div>
              </div>
            ) : imageUrl ? (
              // Generated wallpaper
              <img
                src={imageUrl}
                alt="Generated wallpaper"
                className="w-full h-full object-cover animate-fade-in"
              />
            ) : (
              // Placeholder state
              <div className="absolute inset-0 flex flex-col items-center justify-center text-bone-dark">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-bone-dark/30 flex items-center justify-center mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <p className="text-sm">Your wallpaper will appear here</p>
              </div>
            )}

            {/* Status bar overlay (subtle) */}
            <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />

            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <div className="w-32 h-1 bg-white/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Reflection effect */}
      <div
        className="absolute inset-0 rounded-[3rem] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      />
    </div>
  );
}
