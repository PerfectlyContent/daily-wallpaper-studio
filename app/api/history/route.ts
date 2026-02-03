import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../lib/supabase';
import { HistoryResponse, WallpaperRecord } from '../../../types';

export async function GET(request: NextRequest) {
  try {
    // Get pagination params
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '12', 10);
    const offset = (page - 1) * pageSize;

    // Get user from auth (in production, verify JWT token)
    // For demo purposes, we'll use a placeholder user ID
    const userId = 'demo-user-id';

    const supabase = createServerClient();

    // Get total count
    const { count } = await supabase
      .from('wallpapers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get wallpapers for current page
    const { data: wallpapers, error } = await supabase
      .from('wallpapers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error('Database error fetching history:', error);
      return NextResponse.json<HistoryResponse>(
        {
          wallpapers: [],
          total: 0,
          page,
          pageSize,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<HistoryResponse>({
      wallpapers: (wallpapers as WallpaperRecord[]) || [],
      total: count || 0,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json<HistoryResponse>(
      {
        wallpapers: [],
        total: 0,
        page: 1,
        pageSize: 12,
      },
      { status: 500 }
    );
  }
}
