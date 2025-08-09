// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f9fafb",
        foreground: "#111827",
        input: '#f5f5f7',
        border: "#e5e7eb",
        ring: '#b6b6c2',
      },
      borderColor: {
        border: "#e5e7eb",
      },
      ringColor: {
        ring: "#b6b6c2",
      },
    },
  },
  plugins: [],
}
