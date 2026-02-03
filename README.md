# Daily Wallpaper Studio

An AI-powered wallpaper creation app for the mobile VAS (value-added services) industry. Create one personalised wallpaper per day with guided creativity and strong visual guardrails.

![Daily Wallpaper Studio](https://via.placeholder.com/1200x630/0a0a0c/f5f0eb?text=Daily+Wallpaper+Studio)

## What is this?

Daily Wallpaper Studio is a curated, template-driven wallpaper app that lets users create one personalised wallpaper per day. Not "type anything and pray" — guided creativity with strong visual guardrails that feels intentional and premium.

### Features

- **7 Style Universes** — Each with its own visual language, color palettes, and patterns
- **Guided Creation** — No prompt engineering needed; curated options ensure premium results
- **Daily Limit** — One wallpaper per day makes each creation feel special
- **Custom Mode** — Freeform creation with quality guardrails for users who want more control
- **Wallpaper History** — All your creations saved in a personal gallery
- **Premium Quality** — Generated at 1080x1920, perfect for any phone lock screen

### Style Universes

1. **Minimal (◯)** — Clean lines, breathing space
2. **Abstract (◈)** — Bold shapes, fluid forms
3. **Nature (❋)** — Organic textures, earth tones
4. **Mood (◐)** — Atmosphere, emotion, feeling
5. **Kids (✦)** — Playful, bright, imaginative
6. **Retro (◉)** — Vintage vibes, throwback feels
7. **Custom (✎)** — Your own vision, guided

## Tech Stack

- **Frontend**: Next.js 14+ with App Router, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (auth, daily limits, wallpaper history)
- **Image Generation**:
  - FLUX.1 Schnell via Replicate (template modes) — ~$0.003-0.01/image
  - OpenAI GPT Image API (Custom mode) — ~$0.01/image
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Replicate API token
- OpenAI API key

### 1. Clone and Install

```bash
cd daily-wallpaper-studio
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your API keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Image Generation
REPLICATE_API_TOKEN=your_replicate_api_token
OPENAI_API_KEY=your_openai_api_key
```

### 3. Set Up Supabase Database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the schema SQL from `lib/supabase.ts` (exported as `SCHEMA_SQL`)

The schema creates:
- `users` table (extends Supabase auth)
- `wallpapers` table (stores generated wallpapers)
- `daily_limits` table (tracks daily generation limits)
- Row Level Security (RLS) policies
- Automatic user profile creation on signup

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 5. Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Project Structure

```
daily-wallpaper-studio/
├── app/
│   ├── layout.tsx              # Root layout with nav and footer
│   ├── page.tsx                # Home/landing page
│   ├── globals.css             # Global styles and Tailwind
│   ├── create/
│   │   └── page.tsx            # Full creation flow
│   ├── history/
│   │   └── page.tsx            # Wallpaper gallery
│   ├── auth/
│   │   └── page.tsx            # Login/signup
│   └── api/
│       ├── generate/route.ts   # Image generation endpoint
│       ├── history/route.ts    # Fetch wallpaper history
│       └── daily-status/route.ts  # Check daily limit
├── components/
│   ├── StyleCard.tsx           # Style universe card
│   ├── PaletteSelector.tsx     # Color palette picker
│   ├── PatternSelector.tsx     # Pattern style picker
│   ├── TimeOfDayPicker.tsx     # Dawn/Day/Dusk/Night
│   ├── VibePicker.tsx          # Mood selection pills
│   ├── PersonalTextInput.tsx   # Text input with counter
│   ├── PhoneMockup.tsx         # Phone frame preview
│   ├── GeneratingSpinner.tsx   # Loading animation
│   ├── WallpaperResult.tsx     # Result with download
│   └── DailyStatusBadge.tsx    # Available/used indicator
├── lib/
│   ├── prompt-builder.ts       # Prompt construction logic
│   ├── image-api.ts            # Replicate/OpenAI API calls
│   ├── supabase.ts             # Supabase client + schema
│   ├── style-data.ts           # Style universes definition
│   └── daily-limit.ts          # Limit checking/updating
├── types/
│   └── index.ts                # TypeScript types
└── public/
```

## Configuration

### Daily Limits by Subscription Tier

| Tier    | Daily Generations |
|---------|-------------------|
| Free    | 1                 |
| Premium | 3                 |
| Carrier | 5                 |

### Image Generation APIs

- **Template modes** (Minimal, Abstract, etc.) use **FLUX.1 Schnell** via Replicate
  - Cost: ~$0.003-0.01 per image
  - Best for: Consistent, predictable results with curated prompts

- **Custom mode** uses **OpenAI GPT Image API** (DALL-E 3)
  - Cost: ~$0.01 per image (standard quality)
  - Best for: Handling unpredictable user input

## Important Notes

### Image Storage

For the MVP, wallpapers are stored using:
1. The original image URL from Replicate/OpenAI (temporary)
2. A base64 thumbnail for the history view

**Production recommendation**: Move to Supabase Storage or AWS S3 for permanent image storage. Replicate URLs expire after a period.

### Authentication

The current implementation uses placeholder user IDs for demo purposes. In production:
1. Enable Supabase Auth
2. Update API routes to verify JWT tokens
3. Use `auth.uid()` in RLS policies

### Error Handling

- Image generation failures don't consume daily limits
- Friendly error messages with "Try again" options
- Server-side validation for all API routes

## Customization

### Adding New Style Universes

Edit `lib/style-data.ts`:

```typescript
{
  id: 'your-style',
  name: 'Your Style',
  icon: '🎨',
  description: 'Your style description',
  tagline: 'Your tagline',
  previewGradient: 'linear-gradient(...)',
  palettes: [...],
  patterns: [...],
  promptTemplate: `Your prompt template with {{placeholders}}`,
}
```

### Modifying Prompt Templates

Each style universe has a `promptTemplate` with placeholders:
- `{{pattern}}` — Pattern description
- `{{palette}}` — Palette name
- `{{colors}}` — Hex color values
- `{{timeOfDay}}` — Lighting description
- `{{vibe}}` — Mood description
- `{{personalText}}` — User's custom text

### Styling

The app uses Tailwind CSS with custom configuration in `tailwind.config.ts`:
- Dark theme colors (`background`, `bone`)
- Google Fonts (Instrument Serif, DM Sans)
- Custom animations
- Mobile-first responsive design

## API Reference

### POST /api/generate

Generate a new wallpaper.

```typescript
// Request
{
  selections: {
    styleUniverse: 'minimal',
    palette: 'bone',
    pattern: 'geometric-grid',
    timeOfDay: 'dawn',
    vibe: 'serene',
    personalText?: 'Hello'
  }
}

// Response
{
  success: true,
  imageUrl: 'https://...',
  thumbnailBase64: 'data:image/png;base64,...',
  wallpaperId: 'uuid',
  promptSent: 'Full prompt sent to API'
}
```

### GET /api/daily-status

Get user's daily generation status.

```typescript
// Response
{
  generationsUsed: 0,
  maxGenerations: 1,
  remaining: 1,
  canGenerate: true,
  resetsAt: '2024-01-02T00:00:00.000Z'
}
```

### GET /api/history

Get user's wallpaper history (paginated).

```typescript
// Query params
?page=1&pageSize=12

// Response
{
  wallpapers: [...],
  total: 24,
  page: 1,
  pageSize: 12
}
```

## License

MIT

---

Built with ❤️ for the mobile VAS industry.
