/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Adjust paths to your project files
  theme: {
    extend: {
      keyframes: {
        underlineExpand: {
          '0%': { width: '0%', left: '50%' },
          '50%': { width: '50%', left: '25%' },
          '100%': { width: '100%', left: '0%' },
        },
      },
      animation: {
        underlineExpand: 'underlineExpand 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
};
