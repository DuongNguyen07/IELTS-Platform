import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './client/components/**/*.{js,ts,jsx,tsx,mdx}',
    './client/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      colors: {
        primary: '#2b6cee',
        navy: '#0d121b',
        teal: '#14b8a6',
        success: '#10B981',
        'exam-bg': '#FDF7F2',
      },
    },
  },
  plugins: [],
};

export default config;
