'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WallpaperRecord } from '../../types';

export default function HistoryPage() {
  const router = useRouter();
  const [wallpapers, setWallpapers] = useState<WallpaperRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperRecord | null>(null);

  useEffect(() => {
    fetch('/api/history?pageSize=50')
      .then(res => res.json())
      .then(data => setWallpapers(data.wallpapers || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleDownload = async (wallpaper: WallpaperRecord) => {
    const url = wallpaper.image_url || wallpaper.thumbnail_base64;
    if (!url) return;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `wallpaper-${wallpaper.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-bone-muted"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Back</span>
          </button>
          <h1 className="font-serif text-lg text-bone">History</h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-6 h-6 border-2 border-bone border-t-transparent rounded-full" />
          </div>
        )}

        {!isLoading && wallpapers.length === 0 && (
          <div className="text-center py-16">
            <span className="text-4xl mb-4 block">📚</span>
            <h2 className="font-serif text-xl text-bone mb-2">No wallpapers yet</h2>
            <p className="text-bone-muted text-sm mb-6">
              Create your first wallpaper
            </p>
            <Link
              href="/create"
              className="inline-block px-6 py-3 rounded-xl bg-bone text-background font-medium"
            >
              Create wallpaper
            </Link>
          </div>
        )}

        {!isLoading && wallpapers.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {wallpapers.map((wallpaper) => (
              <button
                key={wallpaper.id}
                onClick={() => setSelectedWallpaper(wallpaper)}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-background-secondary"
              >
                <img
                  src={wallpaper.thumbnail_base64 || wallpaper.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-bone text-xs font-medium capitalize">
                    {wallpaper.style_universe}
                  </p>
                  <p className="text-bone-muted text-xs">
                    {formatDate(wallpaper.created_at)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Detail modal */}
      {selectedWallpaper && (
        <div
          className="fixed inset-0 z-50 bg-background/95 animate-fade-in"
          onClick={() => setSelectedWallpaper(null)}
        >
          <div className="h-full flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between h-14 px-4">
              <button
                onClick={() => setSelectedWallpaper(null)}
                className="text-bone-muted"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <p className="text-bone-muted text-sm capitalize">
                {selectedWallpaper.style_universe}
              </p>
              <div className="w-6" />
            </div>

            {/* Wallpaper */}
            <div className="flex-1 flex items-center justify-center p-4">
              <img
                src={selectedWallpaper.image_url || selectedWallpaper.thumbnail_base64}
                alt=""
                className="max-h-full max-w-full rounded-2xl object-contain"
              />
            </div>

            {/* Actions */}
            <div className="p-4 pb-8">
              <button
                onClick={() => handleDownload(selectedWallpaper)}
                className="
                  w-full py-4 rounded-2xl
                  bg-bone text-background
                  font-medium text-lg
                  flex items-center justify-center gap-3
                  active:scale-[0.98] transition-transform
                "
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Save to Photos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
