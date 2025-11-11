import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-dark': '#1d4ed8',
        surface: '#f8fafc',
        border: '#e2e8f0',
      },
    },
  },
  plugins: [],
};

export default config;
