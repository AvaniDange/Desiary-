/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // Include all JavaScript and JSX files in the src folder
  ],
  theme: {
    extend: {
      backgroundImage: {
        'home-bg': "url('/Flowersbg.jpg')",
      },
      fontFamily: {
        prata: ['Prata', 'serif'],
        alexBrush: ['Alex Brush', 'cursive'],
      }
    },
  },
  plugins: [],
};
