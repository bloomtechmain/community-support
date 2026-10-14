/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "xero-blue": "#00b7e8",
        "xero-darkBlue": "#007cb2",
        "xero-green": "#1abc9c",
        "xero-darkGreen": "#16a085",
      },
    },
  },
  plugins: [],
}
