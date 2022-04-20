/* eslint-env node */

import { node } from '../../.electron-vendors.cache.json';
import { join, resolve } from 'path';
import { builtinModules } from 'module';

// Plugins
import reactVite from '@vitejs/plugin-react';
import electronRenderer from 'vite-plugin-electron/renderer';
import checker from 'vite-plugin-checker';

// SCSS configs
const scssVariables = resolve(__dirname, './main-ui/styles/variables.scss');

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'main-ui') + '/',
      '@styles/': join(PACKAGE_ROOT, 'main-ui', 'styles') + '/',
      '@models/': join(PACKAGE_ROOT, '../models') + '/',
      '@viewmodels/': join(PACKAGE_ROOT, '../viewmodels') + '/',
      '@database/': join(PACKAGE_ROOT, '../database') + '/',
      '@charts/': join(PACKAGE_ROOT, 'main-ui', 'charts') + '/',
      '@widgets/': join(PACKAGE_ROOT, 'main-ui', 'widgets') + '/',
      '@utils/': join(PACKAGE_ROOT, '../utils') + '/',
    },
  },

  plugins: [
    reactVite(),
    electronRenderer(),
    checker({
      typescript: {
        tsconfigPath: './tsconfig.json',
      },
    }),
  ],
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `node${node}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: {
        main: join(PACKAGE_ROOT, 'index.html'),
      },

      external: [...builtinModules.flatMap((p) => [p, `node:${p}`])],
    },
    emptyOutDir: true,
    brotliSize: false,
  },
  test: {
    environment: 'happy-dom',
  },
};

export default config;
