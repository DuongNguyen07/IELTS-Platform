/** @type {import('tailwindcss').Config} */
module.exports = {
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
      },
    },
  },
  plugins: [],
}