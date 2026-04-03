/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        skillmap: {
          bg: '#0f0f0f',
          card: '#1a1a1a',
          accent: '#39c5bb',
          text: '#e6f5f4',
          muted: '#8ba5a3',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'Segoe UI', 'sans-serif'],
        body: ['Manrope', 'Segoe UI', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(57, 197, 187, 0.25)',
      },
      backgroundImage: {
        mesh:
          'radial-gradient(circle at 10% 20%, rgba(57,197,187,0.18), transparent 35%), radial-gradient(circle at 85% 10%, rgba(246,176,80,0.12), transparent 30%), radial-gradient(circle at 50% 80%, rgba(84,97,255,0.16), transparent 40%)',
      },
    },
  },
  plugins: [],
}
