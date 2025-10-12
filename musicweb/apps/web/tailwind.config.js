import sharedConfig from '@repo/tailwind-config/sharedConfig';

/** @type {import('tailwindcss').Config} */
const config = {
  ...sharedConfig,
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    ...sharedConfig.theme,
    extend: {
      ...sharedConfig.theme.extend,
      colors: {
        // Main theme colors
        primary: {
          DEFAULT: '#C5CBE3', // soft blue
          light: '#E0E5F2',
          dark: '#9FB1D1',
        },
        secondary: {
          DEFAULT: '#4056A1', // dark blue
          light: '#6676C0',
          dark: '#2A3870',
        },
        accent: {
          DEFAULT: '#D79922', // gold/orange
          light: '#F0B84B',
          dark: '#A66F16',
        },
        destructive: {
          DEFAULT: '#F13C20', // red
          light: '#F56B54',
          dark: '#B82A17',
        },
        background: {
          DEFAULT: '#EFE2BA', // light cream
          light: '#FFF7E0',
          dark: '#D9CC9A',
        },
        foreground: '#4056A1', // main text color

        muted: {
          DEFAULT: '#A0A0A0',
          light: '#CFCFCF',
          dark: '#707070',
        },
        success: {
          DEFAULT: '#27AE60',
          light: '#6FCF97',
          dark: '#1B6D44',
        },
        info: {
          DEFAULT: '#2D9CDB',
          light: '#56B6E5',
          dark: '#1F6F9D',
        },
        warning: {
          DEFAULT: '#F2C94C',
          light: '#F7D57C',
          dark: '#B3892D',
        },

        card: { DEFAULT: '#EFE2BA', foreground: '#4056A1' },
        popover: { DEFAULT: '#EFE2BA', foreground: '#4056A1' },

        backgroundImage: {
          pattern: "url('/images/pattern.webp')",
        },
      },
    },
  },
};

export default config;
