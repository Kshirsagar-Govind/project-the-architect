/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#E0F2F1',
          100: '#B2DFDB',
          200: '#80CBC4',
          300: '#4DB6AC',
          400: '#26A69A',
          500: '#00897B', // Primary teal
          600: '#00796B',
          700: '#00695C',
          800: '#004D40',
          900: '#004D40',
        },
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        stats: {
        CRITICAL: "rgba(220, 38, 38, 0.7)", // soft red
        HIGH: "rgba(249, 115, 22, 0.7)",    // soft orange
        MEDIUM: "rgba(250, 204, 21, 0.7)",  // soft yellow
        LOW: "rgba(22, 163, 74, 0.7)",      // soft green
        },
        primary: {
          DEFAULT: "#00897B",
          light: "#4DB6AC",
          dark: "#00695C",
          darker: "#004D40",
          contrast: "#ffffff",
        },
        secondary: {
          DEFAULT: "#424242",
          light: "#6D6D6D",
          dark: "#1B1B1B",
          contrast: "#ffffff",
        },
        success: {
          DEFAULT: "#4CAF50",
          light: "#81C784",
          dark: "#388E3C",
        },
        error: {
          DEFAULT: "#F44336",
          light: "#E57373",
          dark: "#C62828",
        },
        warning: {
          DEFAULT: "#FF9800",
          light: "#FFB74D",
          dark: "#F57C00",
        },
        info: {
          DEFAULT: "#2196F3",
          light: "#64B5F6",
          dark: "#1976D2",
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
