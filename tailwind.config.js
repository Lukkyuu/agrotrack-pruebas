/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0D5C3A',
          accent: '#10B981',
          hover: '#09432A',
        },
        farm: {
          grass: '#6FCF97',
          'grass-dark': '#3F9E67',
          'grass-light': '#C8F0D9',
          cream: '#FFF8E7',
          sun: '#FFC94D',
          barn: '#E8543E',
          soil: '#5C3D2E',
        },
      },
      fontFamily: {
        sans: ['"Nunito Sans"', 'Inter', 'system-ui', 'sans-serif'],
        baloo: ['"Baloo 2"', 'cursive', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
      },
      boxShadow: {
        comic: '4px 4px 0px #5C3D2E',
        'comic-sm': '2px 2px 0px #5C3D2E',
        'comic-lg': '6px 6px 0px #5C3D2E',
      },
    },
  },
  plugins: [],
}
