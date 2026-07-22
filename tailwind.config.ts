import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#22d3ee',
        'accent-soft': 'rgba(34, 211, 238, 0.14)',
        'accent-strong': 'rgba(34, 211, 238, 0.55)',
        'accent-glow': 'rgba(34, 211, 238, 0.28)',
        bg: '#0b1020',
        'bg-elevated': '#0f172a',
        surface: 'rgba(15, 23, 42, 0.72)',
        'surface-solid': '#111827',
        'surface-hover': 'rgba(255, 255, 255, 0.05)',
        glass: 'rgba(255, 255, 255, 0.07)',
        'glass-border': 'rgba(255, 255, 255, 0.12)',
        muted: '#94a3b8',
        danger: '#f87171',
        warning: '#fbbf24',
        success: '#34d399',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        serif: ['Source Serif 4', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '18px',
        xl: '14px',
        lg: '10px',
      },
      boxShadow: {
        glass: '0 25px 60px rgba(0, 0, 0, 0.45)',
        glow: '0 0 40px rgba(34, 211, 238, 0.25)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow':
          'radial-gradient(circle at 10% 0%, rgba(34, 211, 238, 0.10), transparent 35%), radial-gradient(circle at 90% 10%, rgba(99, 102, 241, 0.10), transparent 35%)',
      },
    },
  },
  plugins: [],
}
export default config
