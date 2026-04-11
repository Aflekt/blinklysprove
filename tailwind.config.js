/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vv: {
          text: '#444f55',
          'text-soft': '#6b757a',
          cream: '#fff5e6',
          light: '#f5f5f5',
          border: '#e3e3e3',
          danger: '#c8102e',
          'danger-soft': '#fbe9ec',
          success: '#2d6a4f',
        },
      },
      fontFamily: {
        vv: ['"LFT Etica"', '"Lucida Sans Unicode"', '"Lucida Grande"', 'sans-serif'],
        mono: ['"Courier New"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
