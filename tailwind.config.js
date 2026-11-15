/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noun: {
          red: '#E63946',
          blue: '#1D4ED8',
          yellow: '#FFC700',
          green: '#10B981',
          bg: '#F5F5F0',
          cream: '#FAF8F5',
          dark: '#121214',
          gray: '#E8E8E3',
          border: '#27272A',
          subtle: '#F0EFEA'
        }
      },
      fontFamily: {
        sans: ['"Londrina Solid"', 'Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        londrina: ['"Londrina Solid"', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        'noun-sm': '2px 2px 0px #18181B',
        'noun-md': '4px 4px 0px #18181B',
        'noun-lg': '6px 6px 0px #18181B',
      }
    },
  },
  plugins: [],
}
