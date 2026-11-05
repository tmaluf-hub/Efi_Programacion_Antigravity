/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './*.html',
    './pages/**/*.html',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3F4E63',
          dark: '#2D3847',
          light: '#53657E'
        },
        accent: {
          DEFAULT: '#B8654A',
          hover: '#9E533C',
          light: '#D38066'
        },
        sand: {
          DEFAULT: '#D4BC94',
          light: '#E6D7BE',
          dark: '#BCA073'
        },
        cream: {
          DEFAULT: '#F5EFE6',
          dark: '#EAE1D2'
        },
        ink: {
          DEFAULT: '#1F2733',
          muted: '#4B5563',
          light: '#6B7280'
        }
      },
      fontFamily: {
        heading: ['"Outfit"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      minHeight: {
        touch: '44px'
      },
      minWidth: {
        touch: '44px'
      }
    }
  },
  plugins: []
}
