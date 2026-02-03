/**
 * Image Generation API
 * Primary: Replicate FLUX Schnell ($0.003/image) - reliable and fast
 * Custom mode: OpenAI DALL-E 3 (better for custom prompts)
 */

export interface GenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

/**
 * FLUX Schnell Configuration
 * Optimized for 4 steps - this is what the model is designed for
 * Single image per request for cost efficiency
 */
const FLUX_CONFIG = {
  num_inference_steps: 4,  // Schnell is optimized for 4 steps
  num_outputs: 1,          // Single image, no variants
  aspect_ratio: '9:16',    // Phone wallpaper format
  output_format: 'webp',   // Smaller file size, good quality
  output_quality: 85,      // Good balance of quality/size
  go_fast: true,           // Use optimizations
};

/**
 * Generates an image using Replicate FLUX Schnell
 * Cost: ~$0.003 per image - fast and reliable
 * Uses 4 steps as Schnell is specifically designed for this
 */
export async function generateWithReplicate(
  prompt: string,
  seed?: number
): Promise<GenerationResult> {
  const apiToken = process.env.REPLICATE_API_TOKEN;

  if (!apiToken) {
    return { success: false, error: 'Replicate API token not configured' };
  }

  try {
    const Replicate = (await import('replicate')).default;
    const replicate = new Replicate({ auth: apiToken });

    console.log('Generating with FLUX Schnell (4 steps)...');
    console.log('Prompt:', prompt.substring(0, 100) + '...');

    const input: Record<string, unknown> = {
      prompt: prompt,
      ...FLUX_CONFIG,
    };

    // Use fixed seed if provided (for reproducible results)
    if (seed !== undefined) {
      input.seed = seed;
    }

    const output = await replicate.run(
      'black-forest-labs/flux-schnell',
      { input }
    );

    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (!imageUrl) {
      return { success: false, error: 'No image generated' };
    }

    console.log('FLUX Schnell generation successful!');
    return { success: true, imageUrl: imageUrl as string };
  } catch (error) {
    console.error('FLUX Schnell generation error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    // Detect rate limit / insufficient credit errors
    if (msg.includes('429') || msg.includes('throttled') || msg.includes('rate limit')) {
      return { success: false, error: 'Rate limited — please wait a moment and try again.' };
    }
    return {
      success: false,
      error: 'Image generation failed. Please try again.',
    };
  }
}

/**
 * Generates an image using OpenAI DALL-E 3
 * Better for custom prompts and complex descriptions
 * Cost: ~$0.04 per image
 */
export async function generateWithOpenAI(
  prompt: string
): Promise<GenerationResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('OpenAI API key not configured');
    return { success: false, error: 'OpenAI API key not configured' };
  }

  try {
    console.log('Generating with OpenAI DALL-E 3...');
    console.log('Prompt:', prompt.substring(0, 100) + '...');

    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({ apiKey });

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1792',
      quality: 'standard',
      style: 'vivid',
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      return { success: false, error: 'No image generated' };
    }

    console.log('OpenAI generation successful!');
    return { success: true, imageUrl };
  } catch (error) {
    console.error('OpenAI generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Image generation failed',
    };
  }
}

/**
 * Main generation function
 * Uses Replicate for template styles (fast, cheap)
 * Uses OpenAI for custom mode (better quality for custom prompts)
 */
export async function generateImage(
  prompt: string,
  useOpenAI: boolean = false
): Promise<GenerationResult> {
  console.log('=== Starting image generation ===');
  console.log('Use OpenAI:', useOpenAI);

  // Use OpenAI for custom mode
  if (useOpenAI) {
    const result = await generateWithOpenAI(prompt);

    // If OpenAI fails, try Replicate as fallback
    if (!result.success) {
      console.log('OpenAI failed, trying Replicate as fallback...');
      return generateWithReplicate(prompt);
    }

    return result;
  }

  // Use Replicate for template styles (fast, cheap, reliable)
  return generateWithReplicate(prompt);
}

/**
 * Creates a base64 thumbnail from an image URL
 */
export async function createThumbnail(imageUrl: string): Promise<string | null> {
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }

  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/png';
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Thumbnail creation error:', error);
    return null;
  }
}
