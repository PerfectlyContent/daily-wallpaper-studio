import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Bold & Vibrant Dark Theme
        background: {
          DEFAULT: '#0a0a0f',     // Deep dark
          secondary: '#12121a',   // Slightly lighter
          tertiary: '#1a1a28',    // Card backgrounds
          elevated: '#222233',    // Elevated surfaces
        },
        // Light text colors
        bone: {
          DEFAULT: '#f5f5f7',     // Primary text (bright white)
          muted: '#a1a1aa',       // Secondary text
          dark: '#71717a',        // Tertiary text
        },
        // Neon accent colors
        accent: {
          DEFAULT: '#8b5cf6',     // Electric purple
          light: '#a78bfa',
          dark: '#7c3aed',
        },
        neon: {
          pink: '#f472b6',
          cyan: '#22d3ee',
          green: '#4ade80',
          orange: '#fb923c',
          yellow: '#facc15',
          purple: '#c084fc',
          blue: '#60a5fa',
        },
        // Glow colors (for shadows)
        glow: {
          purple: 'rgba(139, 92, 246, 0.5)',
          pink: 'rgba(244, 114, 182, 0.5)',
          cyan: 'rgba(34, 211, 238, 0.5)',
          green: 'rgba(74, 222, 128, 0.5)',
        },
        // Style universe palette colors (kept for prompt building)
        palette: {
          'bone-light': '#f5f0eb',
          'ink': '#1a1a1f',
          'sage': '#9caa9c',
          'neon-pink': '#ff3366',
          'neon-cyan': '#00ffcc',
          'pastel-lavender': '#e0d4f7',
          'pastel-peach': '#ffd4c4',
          'earth-ochre': '#c4a35a',
          'earth-umber': '#5c4033',
          'forest-green': '#2d5a3d',
          'forest-moss': '#7a9a7a',
          'desert-sand': '#e5c7a3',
          'desert-terracotta': '#c75b39',
          'ocean-deep': '#1a4a5e',
          'ocean-foam': '#a8d5d8',
          'calm-blue': '#6b8cae',
          'energy-orange': '#ff6b35',
          'melancholy-purple': '#5a4a6f',
          'candy-pink': '#ff7eb3',
          'candy-yellow': '#ffd93d',
          'jungle-green': '#6bcb77',
          'space-purple': '#9b5de5',
          'sunset-orange': '#ff6f3c',
          'sunset-burgundy': '#a12568',
          'synthwave-pink': '#ff2d95',
          'synthwave-blue': '#00f0ff',
          'polaroid-cream': '#f7f3e8',
          'polaroid-brown': '#8b7355',
        },
      },
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'confetti': 'confetti 2.5s ease-out forwards',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(139, 92, 246, 0.3)',
        'glow-md': '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.5)',
        'glow-pink': '0 0 20px rgba(244, 114, 182, 0.4)',
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.4)',
        'neon': '0 0 5px currentColor, 0 0 20px currentColor, 0 0 40px currentColor',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}

export default config
