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
        'peaceful': {
          'bg': '#0f1b13',
          'card': '#f7f5f3', 
          'button': '#9ED5C5',
          'accent': '#8EC3B0',
          'text': '#2d4a35',
          'warm': '#f4f1ed',
        },
      },
      fontFamily: {
        'serif': ['var(--font-merriweather)', 'serif'],
        'sans': ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
}
export default config
