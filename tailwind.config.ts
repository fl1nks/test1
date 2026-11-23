import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF8F4',
        sand: '#EFEBE3',
        sandline: '#E4DFD4',
        ink: '#201D1A',
        inksoft: '#2A2723',
        mute: '#716C64',
        gold: '#A8845C',
        golddeep: '#8C6B3F',
        goldsoft: '#C9B088',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        accent: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 60px -18px rgba(32, 29, 26, 0.28)',
        card: '0 10px 30px -12px rgba(32, 29, 26, 0.18)',
      },
      letterSpacing: {
        kic: '0.32em',
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1.05) translate(0, 0)' },
          '100%': { transform: 'scale(1.18) translate(-1.5%, -3%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        scrollHint: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.9' },
          '50%': { transform: 'translateY(10px)', opacity: '0.4' },
        },
      },
      animation: {
        kenburns: 'kenburns 22s ease-in-out infinite alternate',
        fadeUp: 'fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 32s linear infinite',
        scrollHint: 'scrollHint 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
