/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(var(--theme-primary-rgb) / 0.05)',
          100: 'rgb(var(--theme-primary-rgb) / 0.1)',
          200: 'rgb(var(--theme-primary-rgb) / 0.2)',
          300: 'rgb(var(--theme-primary-rgb) / 0.3)',
          400: 'rgb(var(--theme-primary-rgb) / 0.4)',
          500: 'rgb(var(--theme-primary-rgb) / 1)',
          600: 'rgb(var(--theme-primary-rgb) / 0.85)',
          700: 'rgb(var(--theme-primary-rgb) / 0.7)',
          800: 'rgb(var(--theme-primary-rgb) / 0.55)',
          900: 'rgb(var(--theme-primary-rgb) / 0.4)',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        'theme-bg': 'var(--theme-bg)',
        'theme-text': 'var(--theme-text)',
        'theme-border': 'var(--theme-border)',
      },
      boxShadow: {
        'canvas': '0 0 0 1px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.1)',
        'panel': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
}
