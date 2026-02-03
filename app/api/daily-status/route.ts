import { NextRequest, NextResponse } from 'next/server';
import { getDailyStatus } from '../../../lib/daily-limit';
import { DailyStatusResponse } from '../../../types';

export async function GET(request: NextRequest) {
  try {
    // Get user from auth (in production, verify JWT token)
    // For demo purposes, we'll use a placeholder user ID
    const userId = 'demo-user-id';

    const status = await getDailyStatus(userId);

    return NextResponse.json<DailyStatusResponse>(status);
  } catch (error) {
    console.error('Daily status API error:', error);

    // Return default status on error
    return NextResponse.json<DailyStatusResponse>({
      generationsUsed: 0,
      maxGenerations: 1,
      remaining: 1,
      canGenerate: true,
      resetsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  }
}
