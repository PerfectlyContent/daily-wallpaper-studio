/**
 * Image Generation API
 * Uses Qwen-Image-2512 via Hugging Face + fal-ai provider
 * Excellent text rendering for wallpapers
 */

export interface GenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

/**
 * Generates an image using Qwen-Image-2512 via fal-ai provider
 * Best for text rendering on wallpapers
 */
export async function generateImage(prompt: string): Promise<GenerationResult> {
  const apiKey = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'Image generation is not configured. Please contact support.'
    };
  }

  try {
    console.log('Generating with Qwen-Image-2512 via fal-ai...');
    console.log('Prompt:', prompt);

    // Add aspect ratio to prompt for 9:16 phone wallpaper
    const enhancedPrompt = `${prompt}. Vertical 9:16 aspect ratio, phone wallpaper format, high quality, detailed.`;

    // Hugging Face Inference API via fal-ai provider for Qwen-Image-2512
    const response = await fetch('https://router.huggingface.co/fal-ai/Qwen/Qwen-Image-2512', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: enhancedPrompt,
        parameters: {
          width: 720,
          height: 1280,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);

      // Check if model is loading
      if (response.status === 503) {
        const errorData = JSON.parse(errorText);
        if (errorData.estimated_time) {
          console.log(`Model loading, estimated time: ${errorData.estimated_time}s`);
          // Wait and retry once
          await new Promise(resolve => setTimeout(resolve, Math.min(errorData.estimated_time * 1000, 30000)));
          return generateImage(prompt); // Retry
        }
      }

      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    // Response is the image blob directly
    const imageBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'image/png';
    const dataUrl = `data:${contentType};base64,${base64}`;

    console.log('Qwen-Image-2512 generation successful!');
    return { success: true, imageUrl: dataUrl };

  } catch (error) {
    console.error('Qwen-Image-2512 generation error:', error);
    const msg = error instanceof Error ? error.message : String(error);

    if (msg.includes('429') || msg.includes('quota') || msg.includes('rate')) {
      return {
        success: false,
        error: 'Too many requests. Please wait a moment and try again.'
      };
    }

    if (msg.includes('safety') || msg.includes('blocked') || msg.includes('sensitive')) {
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
