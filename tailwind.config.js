module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      light: '#C4C4C4',
      light2: '#7F7F7F',
      grey1: '#3D3D3D',
      grey2: '333333',
      dark: '1E1E1E',
      white: '#FFFFFF',
      accent: '#007ACD',
    },
    fontFamily: {
      sans: ['Inter', 'system-ui'],
      serif: ['ui-serif', 'Georgia'],
      mono: ['ui-monospace', 'SFMono-Regular'],
    },
    fontSize: {
      xs: '.75rem',
      sm: '.875rem',
      tiny: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },

    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
