/**
 * @type {import('tailwindcss').Config}
 * Note: Since this project uses Tailwind CSS v4, the system configuration
 * is natively specified in src/index.css using the `@theme` directive.
 * We include this configuration file to document the design system token choices.
 */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta minimalista orgánica neutra y elegante
        neutral: {
          50: '#fbfbfa',   // Crema sutil / Fondo soft
          100: '#f4f4f0',  // Arena muy claro
          200: '#e6e5df',  // Borde sutil / Gris orgánico
          300: '#d7d5cb',
          400: '#bab7a9',
          500: '#8a8775',  // Tono medio / Secundario
          605: '#73705f',
          700: '#5c5a4c',
          800: '#3d3c33',  // Texto principal elegante (No negro puro)
          900: '#21211b',
        },
        wedding: {
          bg: '#FAF7EC',
          light: '#ECE9E2',
          sand: '#E1D7C4',
          sage: '#CBD1A1',
          olive: '#6F744A',
          dark: '#515442',
        }
      },
      fontFamily: {
        // Tipografía Serif elegante para nombres de novios y títulos
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        // Tipografía Sans-serif limpia y moderna para lectura y ui
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'slow-zoom': 'slowZoom 20s ease-out infinite alternate',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
