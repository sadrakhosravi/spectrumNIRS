module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      light: '#C4C4C4',
      light2: '#7F7F7F',
      grey1: '#3D3D3D',
      grey2: '#333333',
      grey3: '#272727',
      grey4: '#7f7f7f',
      dark: '#1E1E1E',
      dark2: '#1c1b1b',
      black: '#000000',
      white: '#FFFFFF',
      accent: '#007ACD',
      'accent-hover': '#0084de',
      red: 'red',
      chart1: '#E3170A',
      chart2: '#ABFF4F',
      chart3: '#00FFFF',
      chart4: '#FFFFFF',
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
    borderWidth: {
      DEFAULT: '1px',
      0: '0',
      2: '2px',
      3: '3px',
      4: '4px',
      6: '6.1px',
      8: '8px',
    },
    fill: {
      grey4: '#7f7f7f',
      white: '#ffffff',
    },

    extend: {
      margin: {
        0.1: '0.2rem',
      },
      height: {
        '30px': '30px',
      },
      maxHeight: {
        '1/4': '25vh',
        '1/2': '50vh',
        '3/4': '75vh',
        '4/5': '80vh',
        '5/6': '83.33333vh',
      },
      gridTemplateColumns: {
        3070: 'repeat 3fr 9fr',
      },
      gridAutoColumns: {
        3070: 'minmax(max-content, 1fr)',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: [],
};
