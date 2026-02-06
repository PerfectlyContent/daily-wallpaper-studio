/**
 * Image Generation API
 * Uses Gemini 2.5 Flash Image for image generation
 * Free tier: ~500-1500 images/day via Google AI Studio
 */

export interface GenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

/**
 * Generates an image using Gemini 2.5 Flash Image
 * Free tier available via Google AI Studio
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
    console.log('Generating with Gemini 2.5 Flash Image...');
    console.log('Prompt:', prompt);

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-preview-04-17',
      generationConfig: {
        responseModalities: ['Text', 'Image'],
      } as any,
    });

    // Enhance prompt for better phone wallpaper results
    const enhancedPrompt = `Create a beautiful phone wallpaper image. ${prompt}.
The image MUST be in vertical 9:16 portrait orientation suitable for a phone screen.
High quality, stunning composition, visually striking.
If there is any text, make sure it fits completely within the image and is clearly readable.`;

    const response = await model.generateContent(enhancedPrompt);
    const result = response.response;

    console.log('Gemini response received, checking for image...');

    // Extract image from response
    for (const part of result.candidates?.[0]?.content?.parts || []) {
      if ((part as any).inlineData) {
        const imageData = (part as any).inlineData.data;
        const mimeType = (part as any).inlineData.mimeType || 'image/png';
        const dataUrl = `data:${mimeType};base64,${imageData}`;

        console.log('Gemini 2.5 Flash Image generation successful!');
        return { success: true, imageUrl: dataUrl };
      }
    }

    // Check if there's text explaining why no image
    const textPart = result.candidates?.[0]?.content?.parts?.find((p: any) => p.text);
    if (textPart) {
      console.log('Gemini returned text instead of image:', (textPart as any).text);
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

    if (msg.includes('not found') || msg.includes('404')) {
      return {
        success: false,
        error: 'Image generation model not available. Please try again later.'
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
