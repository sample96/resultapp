/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Minimal palette: use only Tailwind's green, red, blue, gray, and white
      // Example usage: bg-blue-600, text-green-600, border-red-500, bg-white, bg-gray-50
    },
  },
  plugins: [],
};
