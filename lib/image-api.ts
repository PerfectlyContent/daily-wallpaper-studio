/**
 * Image Generation API
 * Uses Gemini 2.5 Flash Image (nano-banana) for image generation (~$0.039/image)
 * No fallbacks - graceful error handling only
 */

export interface GenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

/**
 * Generates an image using Google Gemini 2.5 Flash Image (nano-banana)
 * Cost: ~$0.039 per image
 */
export async function generateImage(prompt: string): Promise<GenerationResult> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'Image generation is not configured. Please contact support.'
    };
  }

  try {
    console.log('Generating with Imagen 3...');
    console.log('Prompt:', prompt);

    // Use Imagen 3 API directly
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '9:16',
            personGeneration: 'dont_allow',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Imagen API error:', response.status, errorData);
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Imagen response received');

    // Extract image from response
    const prediction = data.predictions?.[0];
    if (prediction?.bytesBase64Encoded) {
      const dataUrl = `data:image/png;base64,${prediction.bytesBase64Encoded}`;
      console.log('Imagen generation successful!');
      return { success: true, imageUrl: dataUrl };
    }

    return {
      success: false,
      error: 'Could not generate image. Please try a different description.'
    };
  } catch (error) {
    console.error('Gemini generation error:', error);
    const msg = error instanceof Error ? error.message : String(error);

    if (msg.includes('429') || msg.includes('quota') || msg.includes('rate')) {
      return {
        success: false,
        error: 'Too many requests. Please wait a moment and try again.'
      };
    }

    if (msg.includes('safety') || msg.includes('blocked')) {
      return {
        success: false,
        error: 'Your request could not be processed. Please try a different description.'
      };
    }

    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
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
