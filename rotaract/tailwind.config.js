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

      animation: {
        'slide-in': 'slideIn 0.3s ease-out forwards',
      },

      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '1' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },

    variants: {
      extend: {
        display: ['print'], // Enable print display utilities like `print:hidden`
      },
    },
  },
  plugins: [
    
  ],
}