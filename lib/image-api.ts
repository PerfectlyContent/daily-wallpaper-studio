/**
 * Image Generation API
 * Uses Qwen-Image-2512 via fal.ai direct API
 * Excellent text rendering for wallpapers
 */

export interface GenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

/**
 * Generates an image using Qwen-Image-2512 via fal.ai
 * Best for text rendering on wallpapers
 */
export async function generateImage(prompt: string): Promise<GenerationResult> {
  const apiKey = process.env.FAL_KEY || process.env.FAL_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'Image generation is not configured. Please contact support.'
    };
  }

  try {
    console.log('Generating with Qwen-Image-2512 via fal.ai...');
    console.log('Prompt:', prompt);

    // Add aspect ratio to prompt for 9:16 phone wallpaper
    const enhancedPrompt = `${prompt}. Vertical 9:16 aspect ratio, phone wallpaper format, high quality, detailed.`;

    // fal.ai direct API for Qwen-Image-2512
    const response = await fetch('https://queue.fal.run/fal-ai/qwen-image-2512', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        negative_prompt: 'blurry, low quality, distorted, cropped text, cut off text',
        image_size: {
          width: 720,
          height: 1280,
        },
        num_images: 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('fal.ai API error:', response.status, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('fal.ai response:', JSON.stringify(data, null, 2));

    // Check if we got a request_id (async queue)
    if (data.request_id) {
      console.log('Got queue request_id:', data.request_id, '- polling for result...');

      // Poll for result
      const maxAttempts = 60;
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const statusResponse = await fetch(`https://queue.fal.run/fal-ai/qwen-image-2512/requests/${data.request_id}/status`, {
          headers: { 'Authorization': `Key ${apiKey}` },
        });

        const statusData = await statusResponse.json();
        console.log(`Poll ${i + 1}/${maxAttempts}: Status =`, statusData.status);

        if (statusData.status === 'COMPLETED') {
          // Get the result
          const resultResponse = await fetch(`https://queue.fal.run/fal-ai/qwen-image-2512/requests/${data.request_id}`, {
            headers: { 'Authorization': `Key ${apiKey}` },
          });
          const resultData = await resultResponse.json();

          if (resultData.images?.[0]?.url) {
            console.log('Qwen-Image-2512 generation successful!');
            return { success: true, imageUrl: resultData.images[0].url };
          }
        } else if (statusData.status === 'FAILED') {
          throw new Error('Generation failed');
        }
      }

      return { success: false, error: 'Generation timed out. Please try again.' };
    }

    // Direct response with images
    if (data.images?.[0]?.url) {
      console.log('Qwen-Image-2512 generation successful!');
      return { success: true, imageUrl: data.images[0].url };
    }

    return { success: false, error: 'No image returned' };

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
