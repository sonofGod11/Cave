/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          'bounce-slow': 'bounce 2.5s infinite',
        },
      },
    },
    plugins: [],
  }