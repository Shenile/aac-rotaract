/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "360px",   
      sm: "480px",   
      md: "768px",   
      lg: "1024px",  
      xl: "1280px",  
      "2xl": "1536px", 
    },

    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // Add Poppins as the sans-serif font
        serif: ['DM Serif Text', 'serif'],     // Add Radley as the serif font
        spectral: ['Spectral', 'serif'],
        radley: ['Radley', 'serif'],
        lexend: ['Lexend', 'sans-serif'],
      },
    },

    variants: {
      extend: {
        display: ['print'], // Enable print display utilities like `print:hidden`
      },
    },
  },
  plugins: [],
}