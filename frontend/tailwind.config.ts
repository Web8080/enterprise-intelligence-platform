import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        panel: '#0b1220',
        accent: '#60a5fa',
        success: '#34d399',
        warning: '#fbbf24',
        danger: '#f87171',
      },
    },
  },
  plugins: [],
};

export default config;
