const path = require('path');

// craco.config.js - Used for TailwindCSS & customizing webpack config
module.exports = {
  webpack: {
    resolve: {
      modules: [path.resolve(__dirname, './')],
    },
    alias: {
      '@icons': path.resolve(__dirname, 'src/assets/icons'),
      '@globalComponent': path.resolve(__dirname, 'src/components/Global'),
      '@container': path.resolve(__dirname, 'src/components/Containers'),
      '@chart': path.resolve(__dirname, 'src/components/Chart'),
      '@server': path.resolve(__dirname, 'server/nirs-reader'),
      '@electron': path.resolve(__dirname, 'electron'),
      '@redux': path.resolve(__dirname, 'redux'),
    },
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
};
