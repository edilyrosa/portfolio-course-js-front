/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
      extend: {
        fontFamily: {
          edily: ['edily', 'sans-serif'],
          titulo: ['titulo', 'sans-serif'],
        },
      },
    },
    content: [
      "./src/**/*.{html,js}", // Asegúrate de incluir las rutas correctas
    ],
  };

  module.exports = {
    theme: {
      extend: {
        fontFamily: {
          'poppins': ['Poppins', 'sans-serif'],
          'lato': ['Lato', 'sans-serif'],
        },
      },
    },
    variants: {},
    plugins: [],
  };