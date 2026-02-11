import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f8fafc',
        card: '#ffffff',
        border: '#e2e8f0'
      }
    }
  },
  plugins: []
};

export default config;
