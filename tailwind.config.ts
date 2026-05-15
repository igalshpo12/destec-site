import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-hebrew)', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      colors: {
        navy:     '#1a2b4a',
        dark:     '#0d1929',
        'des-blue': '#1e90ff',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
};

export default config;
