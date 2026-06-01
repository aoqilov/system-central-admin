/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      tablet: '480px',   // 480 – 1019px
      desktop: '1020px', // 1020 – 1439px
      wide: '1440px',    // 1440px+
    },
    extend: {
      colors: {
        park: {
          bg:         'var(--bg-main)',
          bgCard:     'var(--bg-second)',
          bgHover:    'var(--bg-hover)',
          bgInput:    'var(--bg-input)',
          bgTooltip:  'var(--bg-tooltip)',
          border:     'var(--border-default)',
          border2:    'var(--border-2)',
          text:       'var(--text-default)',
          text2:      'var(--text-2)',
          text3:      'var(--text-3)',
          text4:      'var(--text-4)',
          textMuted:  'var(--text-muted)',
          textDim:    'var(--text-dim)',
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
