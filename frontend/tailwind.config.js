/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bloom-navy": "#0e3b5e",
        "bloom-navy-deep": "#0a2c47",
        "bloom-teal": "#00cba9",
        "bloom-teal-deep": "#00a888",
      },
      // Same lighter weights as apps/website — font-bold/font-extrabold read
      // too heavy at Tailwind's defaults.
      fontWeight: {
        semibold: "450",
        bold: "500",
        extrabold: "600",
      },
    },
  },
  plugins: [],
}
