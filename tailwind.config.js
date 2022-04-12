module.exports = {
  content: [
    './packages/renderer/index.html',
    './packages/renderer/main-ui/**/*.{js,ts,jsx,tsx,scss,css}',
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'SegeoUI', '--apple-system', 'system-ui'],
      serif: ['ui-serif', 'Georgia'],
      mono: ['ui-monospace', 'SFMono-Regular'],
    },

    extend: {
      colors: {
        // BG colors
        appBg: '#1E1E1E',
        panelBg: '#333333',
        titleBarText: '#F1F1F1',
        titleBarBg: '#232323',
        mainBg: '#181818',
        mainBorderColor: '#333333',
        leftNavTextColor: '#b4b4b4',
        // Main colors
        light: '#C4C4C4',
        light2: '#7F7F7F',
        grey0: '#5D5D5D',
        grey1: '#404040',
        grey2: '#333333',
        grey3: '#272727',
        grey4: '#7f7f7f',
        grey5: '#323232',
        dark: '#1E1E1E',
        dark2: '#111111',
        black: '#000000',
        white: '#FFFFFF',
        accent: '#18a6e3',
        current: '#007ACD',
      },
    },
  },
  plugins: [],
};
