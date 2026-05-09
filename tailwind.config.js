/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./store/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg:       "var(--bg)",
        surface:  "var(--surface)",
        surface2: "var(--surface2)",
        border:   "var(--border)",
        text:     "var(--text)",
        text2:    "var(--text2)",
        text3:    "var(--text3)",
        accent:   "var(--accent)",
        accent2:  "var(--accent2)",
        success:  "var(--success)",
        danger:   "var(--danger)",
        warning:  "var(--warning)",
        info:     "var(--info)",
        // Keep legacy names for compat
        background:   "var(--bg)",
        card:         "var(--surface)",
        primary:      "var(--accent)",
        secondary:    "var(--accent2)",
        "text-muted": "var(--text2)",
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
