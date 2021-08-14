const path = require('path');

// craco.config.js - Used for TailwindCSS & customizing webpack config
module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
};
