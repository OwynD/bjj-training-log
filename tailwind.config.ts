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
        // Neutral dark palette (Zinc-based)
        surface: {
          base: '#0a0a0a',      // Main background
          elevated: '#111111',   // Cards, elevated surfaces
          higher: '#1a1a1a',     // Hover states, higher elevation
        },
        border: {
          subtle: '#1f1f1f',     // Subtle borders
          default: '#2a2a2a',    // Default borders
          strong: '#3a3a3a',     // Strong borders
        },
        text: {
          primary: '#ffffff',    // Primary text
          secondary: '#a1a1a1',  // Secondary text
          tertiary: '#6b6b6b',   // Tertiary/muted text
        },
        // Accent colors (refined)
        accent: {
          gold: '#fbbf24',       // Primary CTA
          'gold-hover': '#f59e0b',
          blue: '#60a5fa',       // Gi badge
          purple: '#c084fc',     // No-Gi badge
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.006em' }],
        'base': ['0.9375rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.011em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.014em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.019em' }],
      },
      borderRadius: {
        'sm': '0.375rem',      // 6px
        'DEFAULT': '0.5rem',   // 8px
        'lg': '0.75rem',       // 12px
        'xl': '1rem',          // 16px
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      fontVariantNumeric: {
        'tabular': 'tabular-nums',
      },
      animation: {
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
