/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./popup/**/*.{js,ts,jsx,tsx}",
    "./contents/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#0a0a0a',
        'cyber-gray': '#1a1a1a',
        'neon-green': '#00ff41',
        'neon-pink': '#ff0080',
        'neon-blue': '#00bfff',
        'neon-purple': '#8a2be2'
      },
      fontFamily: {
        'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}
