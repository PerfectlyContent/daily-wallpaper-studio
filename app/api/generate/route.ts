import { NextRequest, NextResponse } from 'next/server';
import { buildPromptWithNegative, getApiForStyle } from '../../../lib/prompt-builder';
import { generateImage, createThumbnail } from '../../../lib/image-api';
import { canGenerate, incrementGenerationCount } from '../../../lib/daily-limit';
import { createServerClient } from '../../../lib/supabase';
import { WallpaperSelections, GenerateResponse } from '../../../types';
import { getPalette, getPattern } from '../../../lib/style-data';
import { hashPrompt, getCachedImage, cacheImage } from '../../../lib/image-cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selections } = body as { selections: WallpaperSelections };

    // Validate selections
    if (!selections || !selections.styleUniverse) {
      return NextResponse.json<GenerateResponse>(
        { success: false, error: 'Invalid selections provided' },
        { status: 400 }
      );
    }

    // Get user from auth (in production, verify JWT token)
    // For demo purposes, we'll use a placeholder user ID
    // In production, this should come from Supabase auth
    const userId = 'demo-user-id';

    // Check daily limit (server-side enforcement)
    const limitStatus = await canGenerate(userId);
    if (!limitStatus.canGenerate) {
      return NextResponse.json<GenerateResponse>(
        {
          success: false,
          error: 'Daily limit reached. Come back tomorrow for a fresh wallpaper!',
        },
        { status: 429 }
      );
    }

    // Build the prompt with negative prompt
    let promptData: { prompt: string; negativePrompt: string };
    try {
      promptData = buildPromptWithNegative(selections);
    } catch (err) {
      return NextResponse.json<GenerateResponse>(
        {
          success: false,
          error: 'Failed to build prompt. Please check your selections.',
        },
        { status: 400 }
      );
    }

    const { prompt } = promptData;

    // Check cache first - same prompt = same image (cost optimization)
    const promptHash = hashPrompt(prompt);
    const cached = getCachedImage(promptHash);

    if (cached) {
      console.log('Cache hit! Serving cached image');
      // Still count against daily limit for fairness
      await incrementGenerationCount(userId);

      return NextResponse.json<GenerateResponse>({
        success: true,
        imageUrl: cached.imageUrl,
        thumbnailBase64: cached.thumbnailBase64,
        promptSent: prompt,
      });
    }

    // Determine which API to use
    const useOpenAI = getApiForStyle(selections.styleUniverse) === 'openai';

    // Generate the image
    const result = await generateImage(prompt, useOpenAI);

    if (!result.success || !result.imageUrl) {
      return NextResponse.json<GenerateResponse>(
        {
          success: false,
          error: result.error || 'Image generation failed. Please try again.',
        },
        { status: 500 }
      );
    }

    // Create thumbnail for history (base64)
    const thumbnailBase64 = await createThumbnail(result.imageUrl);

    // Cache the generated image for future requests
    cacheImage(promptHash, result.imageUrl, thumbnailBase64 || undefined);

    // Get palette and pattern names for storage
    const palette = selections.palette
      ? getPalette(selections.styleUniverse, selections.palette)
      : null;
    const pattern = selections.pattern
      ? getPattern(selections.styleUniverse, selections.pattern)
      : null;

    // Save to database (skip if Supabase not configured)
    let wallpaper: { id?: string } | null = null;
    const supabase = createServerClient();
    if (supabase) {
      const { data, error: dbError } = await supabase
        .from('wallpapers')
        .insert({
          user_id: userId,
          image_url: result.imageUrl,
          thumbnail_base64: thumbnailBase64,
          style_universe: selections.styleUniverse,
          palette_name: palette?.name || null,
          pattern_name: pattern?.name || null,
          time_of_day: selections.timeOfDay,
          vibe: selections.vibe,
          personal_text: selections.personalText || null,
          custom_prompt: selections.customPrompt || null,
          prompt_sent: prompt,
        })
        .select()
        .single();

      wallpaper = data;
      if (dbError) {
        console.error('Database error saving wallpaper:', dbError);
      }
    }

    // Increment daily limit counter (only after successful generation)
    await incrementGenerationCount(userId);

    return NextResponse.json<GenerateResponse>({
      success: true,
      imageUrl: result.imageUrl,
      thumbnailBase64: thumbnailBase64 || undefined,
      wallpaperId: wallpaper?.id,
      promptSent: prompt,
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json<GenerateResponse>(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
