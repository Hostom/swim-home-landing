/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        water: {
          deep: '#0A3D5C',   /* azul profundo — fundo, headers */
          mid: '#1A7FA8',    /* azul médio — elementos secundários */
          light: '#7DD4F0',  /* azul claro — destaques, ondas */
        },
        sun: '#F5C842',      /* amarelo sol — CTA principal, energia */
        foam: '#EAF7FC',     /* branco-azulado — fundo de seções claras */
        sand: '#F7E9C8',     /* areia — backgrounds quentes, contraste */
        text: {
          dark: '#0D1F2D',   /* texto sobre fundos claros */
          light: '#FFFFFF',  /* texto sobre fundos escuros */
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Nunito"', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}
