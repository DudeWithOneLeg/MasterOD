/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      padding: {
        'safeb': 'env(safe-area-inset-bottom)'
      }
    },
  },
  plugins: [],
}
