/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        archivo: ['"Archivo"', 'system-ui', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Brand
        limpieza: {
          yellow: '#FFD400',
          'yellow-soft': '#FFE666',
          red: '#E30613',
          'red-dark': '#B00410',
          ink: '#141210',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,18,16,.04), 0 8px 24px -12px rgba(20,18,16,.18)',
        'card-hover': '0 2px 4px rgba(20,18,16,.06), 0 20px 40px -16px rgba(20,18,16,.28)',
        soft: '0 1px 3px rgba(43,39,36,.05), 0 12px 32px -16px rgba(43,39,36,.20)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .6s cubic-bezier(0.16,1,0.3,1) both',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
