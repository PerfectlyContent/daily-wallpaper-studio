import { createServerClient } from './supabase';
import { DailyLimit, User } from '../types';

/**
 * Gets today's date in YYYY-MM-DD format in the user's timezone.
 * For simplicity, we use UTC. In production, you'd want to handle timezones properly.
 */
export function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Gets the midnight reset time for tomorrow.
 */
export function getResetTime(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

/**
 * Gets the max generations allowed based on subscription tier.
 */
export function getMaxGenerations(tier: User['subscription_tier']): number {
  switch (tier) {
    case 'premium':
      return 3;
    case 'carrier':
      return 5;
    case 'free':
    default:
      return 1;
  }
}

/**
 * Gets or creates today's daily limit record for a user.
 */
export async function getDailyLimit(userId: string): Promise<DailyLimit | null> {
  const supabase = createServerClient();
  if (!supabase) return null;
  const today = getTodayDate();

  // Try to get existing record
  const { data: existing, error: fetchError } = await supabase
    .from('daily_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (existing) {
    return existing as DailyLimit;
  }

  // Get user's subscription tier to determine max generations
  const { data: user } = await supabase
    .from('users')
    .select('subscription_tier')
    .eq('id', userId)
    .single();

  const maxGenerations = getMaxGenerations(user?.subscription_tier || 'free');

  // Create new record for today
  const { data: newLimit, error: createError } = await supabase
    .from('daily_limits')
    .insert({
      user_id: userId,
      date: today,
      generations_used: 0,
      max_generations: maxGenerations,
    })
    .select()
    .single();

  if (createError) {
    console.error('Error creating daily limit:', createError);
    return null;
  }

  return newLimit as DailyLimit;
}

/**
 * Checks if the user can generate a wallpaper today.
 */
export async function canGenerate(userId: string): Promise<{
  canGenerate: boolean;
  remaining: number;
  generationsUsed: number;
  maxGenerations: number;
}> {
  const limit = await getDailyLimit(userId);

  if (!limit) {
    // Default to allowing one generation if we can't get the limit
    return {
      canGenerate: true,
      remaining: 1,
      generationsUsed: 0,
      maxGenerations: 1,
    };
  }

  const remaining = limit.max_generations - limit.generations_used;

  return {
    canGenerate: remaining > 0,
    remaining: Math.max(0, remaining),
    generationsUsed: limit.generations_used,
    maxGenerations: limit.max_generations,
  };
}

/**
 * Increments the generation count for today.
 * Call this after a successful generation.
 */
export async function incrementGenerationCount(userId: string): Promise<boolean> {
  const supabase = createServerClient();
  if (!supabase) return true; // Skip if no Supabase
  const today = getTodayDate();

  // Get or create today's limit
  const limit = await getDailyLimit(userId);

  if (!limit) {
    return true; // Skip if no limit record
  }

  // Increment the count
  const { error } = await supabase
    .from('daily_limits')
    .update({ generations_used: limit.generations_used + 1 })
    .eq('id', limit.id);

  if (error) {
    console.error('Error incrementing generation count:', error);
    return false;
  }

  return true;
}

/**
 * Gets the daily status for a user (for the API response).
 */
export async function getDailyStatus(userId: string) {
  const status = await canGenerate(userId);

  return {
    generationsUsed: status.generationsUsed,
    maxGenerations: status.maxGenerations,
    remaining: status.remaining,
    canGenerate: status.canGenerate,
    resetsAt: getResetTime(),
  };
}
