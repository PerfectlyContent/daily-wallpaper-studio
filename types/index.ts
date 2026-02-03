// ============================================
// Style Universe Types
// ============================================

export type StyleUniverseId =
  | 'minimal'
  | 'abstract'
  | 'nature'
  | 'mood'
  | 'kids'
  | 'retro'
  | 'custom';

export type TimeOfDay = 'dawn' | 'daylight' | 'dusk' | 'night';

export type Vibe = 'serene' | 'bold' | 'dreamy' | 'edgy' | 'cozy' | 'electric';

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[]; // Array of hex values
  description: string;
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  promptFragment: string; // How this pattern is described in prompts
}

export interface StyleUniverse {
  id: StyleUniverseId;
  name: string;
  icon: string;
  description: string;
  tagline: string;
  palettes: ColorPalette[];
  patterns: Pattern[];
  promptTemplate: string;
  negativePrompt: string; // What to avoid in generation
  previewGradient: string; // CSS gradient for preview cards
}

// ============================================
// User Selection Types
// ============================================

export interface WallpaperSelections {
  styleUniverse: StyleUniverseId;
  palette: string; // palette id
  pattern: string; // pattern id
  timeOfDay: TimeOfDay;
  vibe: Vibe;
  personalText?: string;
  customPrompt?: string; // For custom mode only
}

// ============================================
// API Types
// ============================================

export interface GenerateRequest {
  selections: WallpaperSelections;
}

export interface GenerateResponse {
  success: boolean;
  imageUrl?: string;
  thumbnailBase64?: string;
  wallpaperId?: string;
  error?: string;
  promptSent?: string;
}

export interface DailyStatusResponse {
  generationsUsed: number;
  maxGenerations: number;
  remaining: number;
  canGenerate: boolean;
  resetsAt: string; // ISO timestamp
}

export interface HistoryResponse {
  wallpapers: WallpaperRecord[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================
// Database Types
// ============================================

export interface User {
  id: string;
  email: string;
  subscription_tier: 'free' | 'premium' | 'carrier';
  created_at: string;
  updated_at: string;
}

export interface WallpaperRecord {
  id: string;
  user_id: string;
  image_url: string;
  thumbnail_base64?: string;
  style_universe: StyleUniverseId;
  palette_name: string;
  pattern_name: string;
  time_of_day: TimeOfDay;
  vibe: Vibe;
  personal_text?: string;
  custom_prompt?: string;
  prompt_sent: string;
  created_at: string;
}

export interface DailyLimit {
  id: string;
  user_id: string;
  date: string;
  generations_used: number;
  max_generations: number;
}

// ============================================
// Component Props Types
// ============================================

export interface StyleCardProps {
  universe: StyleUniverse;
  isSelected: boolean;
  onClick: () => void;
}

export interface PaletteSelectorProps {
  palettes: ColorPalette[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export interface PatternSelectorProps {
  patterns: Pattern[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export interface TimeOfDayPickerProps {
  selected: TimeOfDay | null;
  onSelect: (time: TimeOfDay) => void;
}

export interface VibePickerProps {
  selected: Vibe | null;
  onSelect: (vibe: Vibe) => void;
}

export interface PersonalTextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
}

export interface PhoneMockupProps {
  imageUrl?: string;
  isLoading?: boolean;
}

export interface GeneratingSpinnerProps {
  styleUniverse: string;
  vibe: string;
  timeOfDay: string;
}

export interface WallpaperResultProps {
  imageUrl: string;
  onDownload: () => void;
  onTryAgain: () => void;
  onSaveToHistory: () => void;
}

export interface DailyStatusBadgeProps {
  canGenerate: boolean;
  remaining: number;
  maxGenerations: number;
}

// ============================================
// Creation Flow Types
// ============================================

export type CreationStep =
  | 'style-selection'
  | 'configuration'
  | 'generating'
  | 'result';

export interface CreationState {
  step: CreationStep;
  selections: Partial<WallpaperSelections>;
  generatedImage?: string;
  error?: string;
}

// ============================================
// Quick Preset Types
// ============================================

export type PresetCategory = 'energy' | 'calm' | 'bold' | 'fresh';

export interface QuickPreset {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: PresetCategory;
  gradient: string;
  selections: {
    styleUniverse: StyleUniverseId;
    palette: string;
    pattern: string;
    timeOfDay: TimeOfDay;
    vibe: Vibe;
  };
}
