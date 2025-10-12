import { type Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    '../../apps/web/**/*.{ts,tsx}',
    '../../apps/admin/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
