const path = require('path');

// craco.config.js - Used for TailwindCSS & customizing webpack config
module.exports = {
  webpack: {
    alias: {
      '@icons': path.resolve(__dirname, 'src/assets/icons'),
      '@globalComponent': path.resolve(__dirname, 'src/components/Global'),
    },
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
};
