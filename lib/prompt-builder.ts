import { WallpaperSelections } from '../types';
import {
  getStyleUniverse,
  getPalette,
  getPattern,
  getTimeOfDay,
  getVibe,
} from './style-data';

/**
 * Result of prompt building - includes both positive and negative prompts
 */
export interface BuiltPrompt {
  prompt: string;
  negativePrompt: string;
}

/**
 * Builds an optimized image generation prompt from user selections.
 * This is the core of the wallpaper creation system - prompt quality is everything.
 * Returns both positive prompt and negative prompt for best results.
 */
export function buildPrompt(selections: WallpaperSelections): string {
  return buildPromptWithNegative(selections).prompt;
}

/**
 * Builds prompt with both positive and negative components
 */
export function buildPromptWithNegative(selections: WallpaperSelections): BuiltPrompt {
  const {
    styleUniverse: universeId,
    palette: paletteId,
    pattern: patternId,
    timeOfDay: timeId,
    vibe: vibeId,
    personalText,
    customPrompt,
  } = selections;

  // Handle custom mode separately
  if (universeId === 'custom') {
    const customResult = buildCustomPrompt(customPrompt || '', timeId, vibeId);
    return {
      prompt: customResult,
      negativePrompt: 'text, watermark, signature, low quality, blurry, pixelated, distorted, nsfw, inappropriate content'
    };
  }

  // Get all the data
  const universe = getStyleUniverse(universeId);
  const palette = getPalette(universeId, paletteId);
  const pattern = getPattern(universeId, patternId);
  const timeOfDay = getTimeOfDay(timeId);
  const vibe = getVibe(vibeId);

  if (!universe || !palette || !pattern || !timeOfDay || !vibe) {
    throw new Error('Invalid selections provided');
  }

  // Build the prompt from the template
  let prompt = universe.promptTemplate;

  // Replace pattern
  prompt = prompt.replace('{{pattern}}', pattern.promptFragment);

  // Replace palette
  prompt = prompt.replace('{{palette}}', palette.name);
  prompt = prompt.replace('{{colors}}', palette.colors.join(', '));

  // Replace time of day
  prompt = prompt.replace('{{timeOfDay}}', timeOfDay.promptFragment);

  // Replace vibe
  prompt = prompt.replace('{{vibe}}', vibe.promptFragment);

  // Handle personal text
  if (personalText && personalText.trim()) {
    const textIntegration = buildPersonalTextIntegration(personalText, universeId);
    prompt = prompt.replace('{{personalText}}', textIntegration);
  } else {
    prompt = prompt.replace('{{personalText}}', '');
  }

  // Clean up any double spaces
  prompt = prompt.replace(/\s+/g, ' ').trim();

  return {
    prompt,
    negativePrompt: universe.negativePrompt || ''
  };
}

/**
 * Builds a prompt for custom/freeform mode with quality guardrails.
 * Enhanced to handle conversational inputs and transform them into professional prompts.
 */
function buildCustomPrompt(
  userDescription: string,
  timeId?: string,
  vibeId?: string
): string {
  // Check if this is already a complete AI-generated prompt (from conversation flow)
  // These prompts already have quality instructions, so don't over-process them
  const isCompletePrompt = userDescription.toLowerCase().includes('high quality') ||
                           userDescription.toLowerCase().includes('beautiful composition') ||
                           userDescription.length > 200;

  if (isCompletePrompt) {
    // Just do basic safety sanitization, keep the prompt intact
    const safePrompt = userDescription
      .replace(/[<>{}[\]|\\^`]/g, '')
      .trim();
    return safePrompt;
  }

  // For short user inputs, enhance them
  const cleanedDescription = sanitizeUserInput(userDescription);
  const enhancedPrompt = enhanceUserPrompt(cleanedDescription);

  // Build optional modifiers
  let modifiers = '';
  if (timeId) {
    const timeOfDay = getTimeOfDay(timeId as any);
    if (timeOfDay) modifiers += `, ${timeOfDay.promptFragment}`;
  }
  if (vibeId) {
    const vibe = getVibe(vibeId as any);
    if (vibe) modifiers += `, ${vibe.promptFragment}`;
  }

  // Wrap in quality control template
  const prompt = `A phone wallpaper, vertical 9:16 aspect ratio, ${enhancedPrompt}${modifiers}. High quality, clean composition, suitable for phone lock screen, visually striking, professional design. Safe for all audiences.`;

  return prompt;
}

/**
 * Enhances a simple user prompt into a more detailed, professional image generation prompt.
 * This is the "prompt whisperer" - taking casual input and making it AI-ready.
 */
function enhanceUserPrompt(input: string): string {
  const lowerInput = input.toLowerCase();

  // Style keywords to detect and enhance
  const enhancements: Array<{ keywords: string[]; additions: string }> = [
    { keywords: ['calm', 'peaceful', 'serene', 'chill', 'relaxing'], additions: 'tranquil atmosphere, soothing color transitions, gentle visual flow' },
    { keywords: ['bold', 'vibrant', 'energetic', 'powerful', 'strong'], additions: 'high contrast, dynamic composition, striking visual impact' },
    { keywords: ['dreamy', 'soft', 'ethereal', 'magical', 'fantasy'], additions: 'soft ethereal glow, gentle gradients, mystical atmosphere' },
    { keywords: ['minimal', 'clean', 'simple', 'modern'], additions: 'minimalist design, clean lines, balanced negative space' },
    { keywords: ['neon', 'cyber', 'futuristic', 'tech'], additions: 'neon glow effects, cyberpunk aesthetic, electric color accents' },
    { keywords: ['nature', 'forest', 'ocean', 'mountain', 'landscape'], additions: 'natural beauty, organic forms, immersive scenery' },
    { keywords: ['retro', '80s', 'vintage', 'nostalgic'], additions: 'retro aesthetic, nostalgic color palette, vintage vibes' },
    { keywords: ['abstract', 'artistic', 'creative'], additions: 'abstract artistic interpretation, creative composition, unique visual style' },
    { keywords: ['sunset', 'sunrise', 'golden'], additions: 'warm golden hour lighting, beautiful sky gradients' },
    { keywords: ['night', 'dark', 'midnight'], additions: 'nighttime atmosphere, deep shadows, ambient lighting' },
    { keywords: ['pastel', 'soft colors', 'light'], additions: 'soft pastel colors, gentle tones, light and airy feel' },
    { keywords: ['cozy', 'warm', 'comfort'], additions: 'warm cozy atmosphere, inviting color palette, comfortable aesthetic' },
  ];

  // Find matching enhancements
  const matchedAdditions: string[] = [];
  for (const enhancement of enhancements) {
    for (const keyword of enhancement.keywords) {
      if (lowerInput.includes(keyword)) {
        matchedAdditions.push(enhancement.additions);
        break;
      }
    }
  }

  // Build enhanced prompt
  let enhanced = input;
  if (matchedAdditions.length > 0) {
    enhanced += ', ' + matchedAdditions.slice(0, 2).join(', ');
  } else {
    // Default enhancements for prompts without specific keywords
    enhanced += ', beautiful composition, smooth gradients, aesthetically pleasing';
  }

  return enhanced;
}

/**
 * Sanitizes user input for the custom prompt.
 * Removes potentially problematic content while keeping creative freedom.
 */
function sanitizeUserInput(input: string): string {
  // Trim and limit length
  let cleaned = input.trim().slice(0, 150);

  // Remove any prompt injection attempts
  const blockedPhrases = [
    'ignore previous',
    'disregard',
    'forget everything',
    'new instructions',
    'system prompt',
    'nsfw',
    'nude',
    'naked',
    'explicit',
    'violent',
    'gore',
    'blood',
  ];

  const lowerCleaned = cleaned.toLowerCase();
  for (const phrase of blockedPhrases) {
    if (lowerCleaned.includes(phrase)) {
      cleaned = cleaned.replace(new RegExp(phrase, 'gi'), '');
    }
  }

  // Remove any special characters that might break the prompt
  cleaned = cleaned.replace(/[<>{}[\]|\\^`]/g, '');

  // Ensure it doesn't end with problematic punctuation
  cleaned = cleaned.replace(/[.,:;!?]+$/, '');

  return cleaned.trim();
}

/**
 * Integrates personal text into the prompt in a style-appropriate way.
 * Note: AI models struggle with text - we make it very explicit but results vary.
 */
function buildPersonalTextIntegration(
  text: string,
  universeId: string
): string {
  const cleanText = text.trim().slice(0, 20).toUpperCase();

  // Be VERY explicit about text rendering - AI models need strong guidance
  const textInstruction = `IMPORTANT: Include clearly readable text that says exactly "${cleanText}" in large, bold, legible typography prominently displayed in the image.`;

  return textInstruction;
}

/**
 * Generates a descriptive loading message for the generation spinner.
 */
export function getLoadingMessage(selections: WallpaperSelections): string {
  const universe = getStyleUniverse(selections.styleUniverse);
  const vibe = getVibe(selections.vibe);
  const time = getTimeOfDay(selections.timeOfDay);

  if (!universe || !vibe || !time) {
    return 'Crafting your wallpaper...';
  }

  return `Crafting your wallpaper... blending ${universe.name.toLowerCase()} × ${vibe.label.toLowerCase()} × ${time.label.toLowerCase()}`;
}

/**
 * Returns the appropriate API to use based on style universe.
 * Custom mode uses OpenAI GPT Image API for better freeform handling.
 * Template modes use FLUX.1 Schnell via Replicate for cost efficiency.
 */
export function getApiForStyle(universeId: string): 'replicate' | 'openai' {
  return universeId === 'custom' ? 'openai' : 'replicate';
}
