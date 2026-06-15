/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070b14',
          900: '#0d1424',
          800: '#14203b'
        },
        accent: {
          50: '#eefbf6',
          100: '#d5f6e5',
          200: '#acedd1',
          300: '#73ddb7',
          400: '#2fc891',
          500: '#14a46f',
          600: '#0f8459'
        },
        coral: {
          400: '#ff8a65',
          500: '#ff7043',
          600: '#f4511e'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(47,200,145,0.18), 0 20px 70px rgba(0,0,0,0.35)'
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top left, rgba(47,200,145,0.20), transparent 30%), radial-gradient(circle at top right, rgba(255,138,101,0.18), transparent 28%), linear-gradient(180deg, rgba(7,11,20,1), rgba(13,20,36,1))'
      }
    }
  },
  plugins: []
};