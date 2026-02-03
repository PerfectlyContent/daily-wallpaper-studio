import { NextRequest, NextResponse } from 'next/server';
import { browseLibrary, getLibraryStats, getRandomFromLibrary } from '../../../lib/image-cache';

/**
 * Browse pre-generated wallpaper library
 * GET /api/library - Get all or filtered wallpapers
 * GET /api/library?random=true&style=minimal - Get random matching wallpaper
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const styleUniverse = searchParams.get('style') || undefined;
    const vibe = searchParams.get('vibe') || undefined;
    const timeOfDay = searchParams.get('time') || undefined;
    const random = searchParams.get('random') === 'true';

    // Get random from library if requested
    if (random) {
      const wallpaper = getRandomFromLibrary({ styleUniverse, vibe });
      if (wallpaper) {
        return NextResponse.json({
          success: true,
          wallpaper,
        });
      }
      return NextResponse.json({
        success: false,
        error: 'No matching wallpapers in library',
      });
    }

    // Browse the library
    const wallpapers = browseLibrary({ styleUniverse, vibe, timeOfDay });
    const stats = getLibraryStats();

    return NextResponse.json({
      success: true,
      wallpapers,
      stats,
    });
  } catch (error) {
    console.error('Library API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to browse library' },
      { status: 500 }
    );
  }
}
