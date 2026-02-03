import { StyleUniverse, StyleUniverseId, TimeOfDay, Vibe } from '../types';

// ============================================
// Time of Day Options
// ============================================

export const timeOfDayOptions: { id: TimeOfDay; label: string; emoji: string; promptFragment: string }[] = [
  {
    id: 'dawn',
    label: 'Dawn',
    emoji: '🌅',
    promptFragment: 'soft golden hour lighting, warm sunrise glow, gentle morning light'
  },
  {
    id: 'daylight',
    label: 'Daylight',
    emoji: '☀️',
    promptFragment: 'bright natural daylight, clear illumination, balanced lighting'
  },
  {
    id: 'dusk',
    label: 'Dusk',
    emoji: '🌆',
    promptFragment: 'warm sunset colors, golden hour glow, soft evening light'
  },
  {
    id: 'night',
    label: 'Night',
    emoji: '🌙',
    promptFragment: 'nighttime atmosphere, deep shadows, subtle moonlight or ambient glow'
  },
];

// ============================================
// Vibe Options
// ============================================

export const vibeOptions: { id: Vibe; label: string; promptFragment: string }[] = [
  {
    id: 'serene',
    label: 'Serene',
    promptFragment: 'peaceful, calm, tranquil atmosphere, soothing visual balance'
  },
  {
    id: 'bold',
    label: 'Bold',
    promptFragment: 'striking, confident, high contrast, powerful visual impact'
  },
  {
    id: 'dreamy',
    label: 'Dreamy',
    promptFragment: 'ethereal, soft focus, whimsical, floating quality'
  },
  {
    id: 'edgy',
    label: 'Edgy',
    promptFragment: 'dynamic, sharp, unconventional, raw energy'
  },
  {
    id: 'cozy',
    label: 'Cozy',
    promptFragment: 'warm, inviting, comfortable, intimate feeling'
  },
  {
    id: 'electric',
    label: 'Electric',
    promptFragment: 'vibrant, energetic, buzzing with life, high energy'
  },
];

// ============================================
// Style Universes
// ============================================

export const styleUniverses: StyleUniverse[] = [
  // ----------------------------------------
  // 1. MINIMAL (◯)
  // ----------------------------------------
  {
    id: 'minimal',
    name: 'Minimal',
    icon: '◯',
    description: 'Clean lines, breathing space',
    tagline: 'Less is everything',
    previewGradient: 'linear-gradient(135deg, #f5f0eb 0%, #1a1a1f 100%)',
    palettes: [
      {
        id: 'bone',
        name: 'Bone',
        colors: ['#f5f0eb', '#e8e0d5', '#d4c5b9', '#c4b5a5'],
        description: 'Warm off-whites and creams'
      },
      {
        id: 'ink',
        name: 'Ink',
        colors: ['#1a1a1f', '#2d2d35', '#45454f', '#f5f0eb'],
        description: 'Deep blacks with cream accents'
      },
      {
        id: 'sage',
        name: 'Sage',
        colors: ['#9caa9c', '#b8c4b8', '#d4ddd4', '#f5f5f2'],
        description: 'Muted greens, natural calm'
      },
    ],
    patterns: [
      {
        id: 'geometric-grid',
        name: 'Geometric Grid',
        description: 'Precise lines and intersections',
        promptFragment: 'precise geometric grid pattern, clean intersecting lines, mathematical precision'
      },
      {
        id: 'single-line',
        name: 'Single Line',
        description: 'One continuous flowing line',
        promptFragment: 'single continuous line art, one elegant flowing stroke, minimalist line drawing'
      },
      {
        id: 'dot-matrix',
        name: 'Dot Matrix',
        description: 'Evenly spaced points',
        promptFragment: 'dot matrix pattern, evenly spaced circular points, systematic dot arrangement'
      },
      {
        id: 'negative-space',
        name: 'Negative Space',
        description: 'The beauty of emptiness',
        promptFragment: 'negative space composition, strategic emptiness, minimal elements with vast breathing room'
      },
    ],
    promptTemplate: `A phone wallpaper, vertical 9:16 aspect ratio, minimalist design aesthetic with clean lines and generous negative space, {{pattern}} composition, {{palette}} color palette using colors {{colors}}, {{timeOfDay}}, {{vibe}}. {{personalText}} Ultra-clean, sophisticated, modern minimalism, museum-quality design, Apple aesthetic, premium feel.`,
    negativePrompt: 'cluttered, busy, noisy, complex patterns, multiple focal points, text, watermark, signature, low quality, blurry, pixelated, distorted',
  },

  // ----------------------------------------
  // 2. ABSTRACT (◈)
  // ----------------------------------------
  {
    id: 'abstract',
    name: 'Abstract',
    icon: '◈',
    description: 'Bold shapes, fluid forms',
    tagline: 'Beyond the literal',
    previewGradient: 'linear-gradient(135deg, #ff3366 0%, #00ffcc 100%)',
    palettes: [
      {
        id: 'neon-flux',
        name: 'Neon Flux',
        colors: ['#ff3366', '#00ffcc', '#ffcc00', '#9933ff'],
        description: 'Electric neons that pop'
      },
      {
        id: 'pastel-dream',
        name: 'Pastel Dream',
        colors: ['#e0d4f7', '#ffd4c4', '#d4f0f7', '#f7f4d4'],
        description: 'Soft, dreamy pastels'
      },
      {
        id: 'earth',
        name: 'Earth',
        colors: ['#c4a35a', '#5c4033', '#8b7355', '#d4c4a5'],
        description: 'Rich ochres and umbers'
      },
    ],
    patterns: [
      {
        id: 'fluid-blobs',
        name: 'Fluid Blobs',
        description: 'Organic, flowing shapes',
        promptFragment: 'fluid organic blob shapes, smooth flowing forms, liquid-like abstract shapes'
      },
      {
        id: 'sharp-angles',
        name: 'Sharp Angles',
        description: 'Crisp geometric fragments',
        promptFragment: 'sharp angular geometric shapes, crisp edges, fragmented triangles and polygons'
      },
      {
        id: 'layered-waves',
        name: 'Layered Waves',
        description: 'Overlapping wave forms',
        promptFragment: 'layered wave patterns, overlapping curved forms, rhythmic undulating shapes'
      },
      {
        id: 'fragmented',
        name: 'Fragmented',
        description: 'Broken, scattered pieces',
        promptFragment: 'fragmented abstract composition, scattered geometric pieces, deconstructed forms'
      },
    ],
    promptTemplate: `A phone wallpaper, vertical 9:16 aspect ratio, bold abstract art with dynamic shapes and fluid forms, {{pattern}} composition, {{palette}} color palette using colors {{colors}}, {{timeOfDay}}, {{vibe}}. {{personalText}} Striking abstract art, museum-quality composition, visually captivating, gallery-worthy, smooth gradients, perfect color harmony.`,
    negativePrompt: 'photorealistic, faces, text, watermark, signature, low quality, blurry, muddy colors, harsh edges, amateur, clipart style',
  },

  // ----------------------------------------
  // 3. NATURE (❋)
  // ----------------------------------------
  {
    id: 'nature',
    name: 'Nature',
    icon: '❋',
    description: 'Organic textures, earth tones',
    tagline: 'The wild, refined',
    previewGradient: 'linear-gradient(135deg, #2d5a3d 0%, #e5c7a3 100%)',
    palettes: [
      {
        id: 'forest',
        name: 'Forest',
        colors: ['#2d5a3d', '#7a9a7a', '#4a7a5a', '#1a3a2a'],
        description: 'Deep forest greens'
      },
      {
        id: 'desert',
        name: 'Desert',
        colors: ['#e5c7a3', '#c75b39', '#d4a574', '#8b5a3c'],
        description: 'Warm sands and terracotta'
      },
      {
        id: 'ocean',
        name: 'Ocean',
        colors: ['#1a4a5e', '#a8d5d8', '#2d6a7a', '#c4e0e3'],
        description: 'Deep sea to coastal foam'
      },
    ],
    patterns: [
      {
        id: 'botanical',
        name: 'Botanical',
        description: 'Leaves, stems, organic growth',
        promptFragment: 'botanical illustration style, elegant leaves and stems, organic plant forms'
      },
      {
        id: 'topographic',
        name: 'Topographic',
        description: 'Contour lines of terrain',
        promptFragment: 'topographic contour lines, elevation map pattern, terrain visualization'
      },
      {
        id: 'crystal',
        name: 'Crystal',
        description: 'Mineral formations',
        promptFragment: 'crystal formation pattern, geometric mineral structures, crystalline shapes'
      },
      {
        id: 'erosion',
        name: 'Erosion',
        description: 'Weathered, worn textures',
        promptFragment: 'erosion texture pattern, weathered natural surfaces, organic wear patterns'
      },
    ],
    promptTemplate: `A phone wallpaper, vertical 9:16 aspect ratio, nature-inspired design with organic textures and earth-connected aesthetic, {{pattern}} composition, {{palette}} color palette using colors {{colors}}, {{timeOfDay}}, {{vibe}}. {{personalText}} Natural beauty, organic forms, National Geographic quality, serene landscape vibes, professional nature photography aesthetic.`,
    negativePrompt: 'artificial, plastic, neon colors, urban elements, text, watermark, signature, low quality, blurry, oversaturated, cartoon style',
  },

  // ----------------------------------------
  // 4. MOOD (◐)
  // ----------------------------------------
  {
    id: 'mood',
    name: 'Mood',
    icon: '◐',
    description: 'Atmosphere, emotion, feeling',
    tagline: 'Feel the color',
    previewGradient: 'linear-gradient(135deg, #6b8cae 0%, #5a4a6f 100%)',
    palettes: [
      {
        id: 'calm',
        name: 'Calm',
        colors: ['#6b8cae', '#8aa4be', '#a8bcd0', '#c5d4e2'],
        description: 'Peaceful blues and grays'
      },
      {
        id: 'energy',
        name: 'Energy',
        colors: ['#ff6b35', '#ff8c42', '#ffa94d', '#ffcc5c'],
        description: 'Vibrant oranges and yellows'
      },
      {
        id: 'melancholy',
        name: 'Melancholy',
        colors: ['#5a4a6f', '#7a6a8f', '#9a8aaf', '#4a3a5f'],
        description: 'Deep purples and mauves'
      },
    ],
    patterns: [
      {
        id: 'gradient-wash',
        name: 'Gradient Wash',
        description: 'Smooth color transitions',
        promptFragment: 'smooth gradient color wash, seamless color transitions, soft blended tones'
      },
      {
        id: 'grain-texture',
        name: 'Grain Texture',
        description: 'Film-like grain overlay',
        promptFragment: 'subtle film grain texture, analog photography feel, textured surface'
      },
      {
        id: 'light-leak',
        name: 'Light Leak',
        description: 'Ethereal light bleeds',
        promptFragment: 'light leak effect, ethereal light bleeds, soft overexposed areas'
      },
      {
        id: 'atmospheric',
        name: 'Atmospheric',
        description: 'Misty, hazy depth',
        promptFragment: 'atmospheric haze, misty depth, soft fog-like layers'
      },
    ],
    promptTemplate: `A phone wallpaper, vertical 9:16 aspect ratio, mood-driven atmospheric design that evokes emotion through color and texture, {{pattern}} composition, {{palette}} color palette using colors {{colors}}, {{timeOfDay}}, {{vibe}}. {{personalText}} Emotionally resonant, atmospheric depth, feeling over form, cinematic color grading, film photography aesthetic, evocative ambiance.`,
    negativePrompt: 'harsh lighting, flat colors, sharp edges, busy patterns, text, watermark, signature, low quality, blurry, garish colors, clinical feel',
  },

  // ----------------------------------------
  // 5. KIDS (✦)
  // ----------------------------------------
  {
    id: 'kids',
    name: 'Kids',
    icon: '✦',
    description: 'Playful, bright, imaginative',
    tagline: 'Joy unleashed',
    previewGradient: 'linear-gradient(135deg, #ff7eb3 0%, #6bcb77 100%)',
    palettes: [
      {
        id: 'candy',
        name: 'Candy',
        colors: ['#ff7eb3', '#ffd93d', '#7ed3fc', '#b794f4'],
        description: 'Sweet, sugary brights'
      },
      {
        id: 'jungle',
        name: 'Jungle',
        colors: ['#6bcb77', '#ffd93d', '#ff8c42', '#4ecdc4'],
        description: 'Wild tropical colors'
      },
      {
        id: 'space',
        name: 'Space',
        colors: ['#9b5de5', '#00bbf9', '#f15bb5', '#fee440'],
        description: 'Cosmic and stellar'
      },
    ],
    patterns: [
      {
        id: 'confetti',
        name: 'Confetti',
        description: 'Scattered celebration',
        promptFragment: 'scattered confetti pattern, celebratory dots and shapes, party-like arrangement'
      },
      {
        id: 'characters',
        name: 'Characters',
        description: 'Cute illustrated friends',
        promptFragment: 'cute illustrated characters, friendly kawaii-style creatures, adorable simple characters'
      },
      {
        id: 'stickers',
        name: 'Stickers',
        description: 'Sticker-book aesthetic',
        promptFragment: 'sticker collection style, overlapping fun stickers, sticker-book aesthetic'
      },
      {
        id: 'doodles',
        name: 'Doodles',
        description: 'Hand-drawn playfulness',
        promptFragment: 'hand-drawn doodle pattern, playful sketchy lines, childlike drawings'
      },
    ],
    promptTemplate: `A phone wallpaper, vertical 9:16 aspect ratio, playful and imaginative design perfect for kids, {{pattern}} composition, {{palette}} color palette using colors {{colors}}, {{timeOfDay}}, {{vibe}}. {{personalText}} Fun, joyful, age-appropriate, bright and cheerful, Pixar-quality charm, whimsical delight, friendly and inviting.`,
    negativePrompt: 'scary, dark, violent, mature themes, text, watermark, signature, low quality, blurry, creepy, unsettling, realistic faces',
  },

  // ----------------------------------------
  // 6. RETRO (◉)
  // ----------------------------------------
  {
    id: 'retro',
    name: 'Retro',
    icon: '◉',
    description: 'Vintage vibes, throwback feels',
    tagline: 'Timeless nostalgia',
    previewGradient: 'linear-gradient(135deg, #ff6f3c 0%, #a12568 100%)',
    palettes: [
      {
        id: '70s-sunset',
        name: '70s Sunset',
        colors: ['#ff6f3c', '#ff9f43', '#a12568', '#2d1b4e'],
        description: 'Warm retro gradients'
      },
      {
        id: 'synthwave',
        name: 'Synthwave',
        colors: ['#ff2d95', '#00f0ff', '#9b4dca', '#1a1a2e'],
        description: 'Neon 80s cyber'
      },
      {
        id: 'polaroid',
        name: 'Polaroid',
        colors: ['#f7f3e8', '#8b7355', '#a89b8c', '#d4c5b9'],
        description: 'Faded film tones'
      },
    ],
    patterns: [
      {
        id: 'halftone',
        name: 'Halftone',
        description: 'Dotted print texture',
        promptFragment: 'halftone dot pattern, vintage print texture, Ben-Day dots effect'
      },
      {
        id: 'scanlines',
        name: 'Scanlines',
        description: 'CRT monitor lines',
        promptFragment: 'CRT scanline effect, horizontal line texture, vintage monitor aesthetic'
      },
      {
        id: 'cassette',
        name: 'Cassette',
        description: 'Tape deck aesthetic',
        promptFragment: 'cassette tape aesthetic, analog audio visual style, magnetic tape patterns'
      },
      {
        id: 'pixel-grid',
        name: 'Pixel Grid',
        description: 'Early digital pixels',
        promptFragment: 'pixel art grid, retro 8-bit aesthetic, blocky pixel patterns'
      },
    ],
    promptTemplate: `A phone wallpaper, vertical 9:16 aspect ratio, retro-inspired design with vintage aesthetic and nostalgic feel, {{pattern}} composition, {{palette}} color palette using colors {{colors}}, {{timeOfDay}}, {{vibe}}. {{personalText}} Nostalgic, throwback vibes, vintage quality with modern clarity, authentic period aesthetic, tasteful retro styling.`,
    negativePrompt: 'modern minimalist, flat design, contemporary style, text, watermark, signature, low quality, blurry, generic, corporate feel',
  },

  // ----------------------------------------
  // 7. CUSTOM (✎)
  // ----------------------------------------
  {
    id: 'custom',
    name: 'Custom',
    icon: '✎',
    description: "Your own vision, guided",
    tagline: 'Make it yours',
    previewGradient: 'linear-gradient(135deg, #f5f0eb 0%, #d4c5b9 50%, #111118 100%)',
    palettes: [], // Not used for custom
    patterns: [], // Not used for custom
    promptTemplate: `A phone wallpaper, vertical 9:16 aspect ratio, {{customPrompt}}, {{timeOfDay}}, {{vibe}}. High quality, clean composition, suitable for phone lock screen, visually striking, professional design. Safe for all audiences.`,
    negativePrompt: 'text, watermark, signature, low quality, blurry, pixelated, distorted, nsfw, inappropriate content',
  },
];

// ============================================
// Helper Functions
// ============================================

export function getStyleUniverse(id: string): StyleUniverse | undefined {
  return styleUniverses.find(s => s.id === id);
}

export function getPalette(universeId: string, paletteId: string) {
  const universe = getStyleUniverse(universeId);
  return universe?.palettes.find(p => p.id === paletteId);
}

export function getPattern(universeId: string, patternId: string) {
  const universe = getStyleUniverse(universeId);
  return universe?.patterns.find(p => p.id === patternId);
}

export function getTimeOfDay(id: TimeOfDay) {
  return timeOfDayOptions.find(t => t.id === id);
}

export function getVibe(id: Vibe) {
  return vibeOptions.find(v => v.id === id);
}

// ============================================
// Quick Presets - One-Tap Wallpaper Combos
// ============================================

export interface QuickPreset {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'energy' | 'calm' | 'bold' | 'fresh';
  gradient: string;
  selections: {
    styleUniverse: StyleUniverseId;
    palette: string;
    pattern: string;
    timeOfDay: TimeOfDay;
    vibe: Vibe;
  };
}

export const quickPresets: QuickPreset[] = [
  // ⚡ ENERGY
  {
    id: 'neon-dreams',
    name: 'Neon Dreams',
    description: 'Electric vibes',
    emoji: '⚡',
    category: 'energy',
    gradient: 'linear-gradient(135deg, #ff3366 0%, #00ffcc 100%)',
    selections: {
      styleUniverse: 'abstract',
      palette: 'neon-flux',
      pattern: 'fluid-blobs',
      timeOfDay: 'night',
      vibe: 'electric',
    },
  },
  {
    id: 'party-mode',
    name: 'Party Mode',
    description: 'Celebration time',
    emoji: '🎉',
    category: 'energy',
    gradient: 'linear-gradient(135deg, #ff7eb3 0%, #ffd93d 100%)',
    selections: {
      styleUniverse: 'kids',
      palette: 'candy',
      pattern: 'confetti',
      timeOfDay: 'night',
      vibe: 'bold',
    },
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    description: '80s retro cyber',
    emoji: '🌃',
    category: 'energy',
    gradient: 'linear-gradient(135deg, #ff2d95 0%, #00f0ff 100%)',
    selections: {
      styleUniverse: 'retro',
      palette: 'synthwave',
      pattern: 'scanlines',
      timeOfDay: 'night',
      vibe: 'edgy',
    },
  },

  // 🌿 CALM
  {
    id: 'zen-garden',
    name: 'Zen Garden',
    description: 'Peaceful flow',
    emoji: '🌿',
    category: 'calm',
    gradient: 'linear-gradient(135deg, #9caa9c 0%, #f5f5f2 100%)',
    selections: {
      styleUniverse: 'minimal',
      palette: 'sage',
      pattern: 'negative-space',
      timeOfDay: 'dawn',
      vibe: 'serene',
    },
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Coastal calm',
    emoji: '🌊',
    category: 'calm',
    gradient: 'linear-gradient(135deg, #1a4a5e 0%, #a8d5d8 100%)',
    selections: {
      styleUniverse: 'nature',
      palette: 'ocean',
      pattern: 'topographic',
      timeOfDay: 'daylight',
      vibe: 'dreamy',
    },
  },
  {
    id: 'soft-focus',
    name: 'Soft Focus',
    description: 'Mellow mood',
    emoji: '☁️',
    category: 'calm',
    gradient: 'linear-gradient(135deg, #6b8cae 0%, #c5d4e2 100%)',
    selections: {
      styleUniverse: 'mood',
      palette: 'calm',
      pattern: 'atmospheric',
      timeOfDay: 'dusk',
      vibe: 'cozy',
    },
  },

  // 🔥 BOLD
  {
    id: 'desert-heat',
    name: 'Desert Heat',
    description: 'Warm intensity',
    emoji: '🔥',
    category: 'bold',
    gradient: 'linear-gradient(135deg, #c75b39 0%, #e5c7a3 100%)',
    selections: {
      styleUniverse: 'nature',
      palette: 'desert',
      pattern: 'erosion',
      timeOfDay: 'dusk',
      vibe: 'bold',
    },
  },
  {
    id: 'cosmic-pop',
    name: 'Cosmic Pop',
    description: 'Space adventure',
    emoji: '🚀',
    category: 'bold',
    gradient: 'linear-gradient(135deg, #9b5de5 0%, #00bbf9 100%)',
    selections: {
      styleUniverse: 'kids',
      palette: 'space',
      pattern: 'stickers',
      timeOfDay: 'night',
      vibe: 'electric',
    },
  },
  {
    id: '70s-vibes',
    name: '70s Vibes',
    description: 'Retro warmth',
    emoji: '🌅',
    category: 'bold',
    gradient: 'linear-gradient(135deg, #ff6f3c 0%, #a12568 100%)',
    selections: {
      styleUniverse: 'retro',
      palette: '70s-sunset',
      pattern: 'halftone',
      timeOfDay: 'dusk',
      vibe: 'cozy',
    },
  },

  // ✨ FRESH
  {
    id: 'morning-light',
    name: 'Morning Light',
    description: 'Clean start',
    emoji: '☀️',
    category: 'fresh',
    gradient: 'linear-gradient(135deg, #f5f0eb 0%, #d4c5b9 100%)',
    selections: {
      styleUniverse: 'minimal',
      palette: 'bone',
      pattern: 'single-line',
      timeOfDay: 'dawn',
      vibe: 'serene',
    },
  },
  {
    id: 'forest-walk',
    name: 'Forest Walk',
    description: 'Nature escape',
    emoji: '🌲',
    category: 'fresh',
    gradient: 'linear-gradient(135deg, #2d5a3d 0%, #7a9a7a 100%)',
    selections: {
      styleUniverse: 'nature',
      palette: 'forest',
      pattern: 'botanical',
      timeOfDay: 'daylight',
      vibe: 'serene',
    },
  },
  {
    id: 'pastel-cloud',
    name: 'Pastel Cloud',
    description: 'Soft dreams',
    emoji: '🦋',
    category: 'fresh',
    gradient: 'linear-gradient(135deg, #e0d4f7 0%, #ffd4c4 100%)',
    selections: {
      styleUniverse: 'abstract',
      palette: 'pastel-dream',
      pattern: 'layered-waves',
      timeOfDay: 'daylight',
      vibe: 'dreamy',
    },
  },
];

export function getQuickPreset(id: string): QuickPreset | undefined {
  return quickPresets.find(p => p.id === id);
}

export function getPresetsByCategory(category: QuickPreset['category']): QuickPreset[] {
  return quickPresets.filter(p => p.category === category);
}
