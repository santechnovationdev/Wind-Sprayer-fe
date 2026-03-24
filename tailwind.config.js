/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#f1fcfa',
          100: '#cef9f2',
          200: '#9df2e6',
          300: '#64e4d5',
          400: '#34cdc1',
          500: '#1bb0a6',
          600: '#142d57',
          700: '#13726e',
          800: '#145b59',
          900: '#164b4a',
          950: '#062c2d'
        },
        'secondary': {
          50: '#edfcf4',
          100: '#d3f8e3',
          200: '#abefcd',
          300: '#75e0b1',
          400: '#3dca8f',
          500: '#1ab077',
          600: '#0d8e60',
          700: '#0b714f',
          800: '#0b5a40',
          900: '#0a4a36',
          950: '#042a1f'
        }
      }
    },
  },
  plugins: [],
}

