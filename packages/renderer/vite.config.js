/* eslint-env node */

import { chrome } from '../../.electron-vendors.cache.json';
import { join } from 'path';
import { builtinModules } from 'module';

// Plugins
import reactVite from '@vitejs/plugin-react';
import electronRenderer from 'vite-plugin-electron/renderer';
import polyfillExports from 'vite-plugin-electron/polyfill-exports';

import checker from 'vite-plugin-checker';

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
      '@store': join(PACKAGE_ROOT, '../viewmodels/VMStore.ts'),
      '@database/': join(PACKAGE_ROOT, '../database') + '/',
      '@charts/': join(PACKAGE_ROOT, 'main-ui', 'charts') + '/',
      '@widgets/': join(PACKAGE_ROOT, 'main-ui', 'widgets') + '/',
      '@utils/': join(PACKAGE_ROOT, '../utils') + '/',
    },
  },

  plugins: [
    reactVite(),
    electronRenderer(),
    polyfillExports(),

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
    port: 7777,
    rollupOptions: {
      output: {
        format: 'cjs',
        exports: 'auto',
      },
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',

    rollupOptions: {
      input: {
        main: join(PACKAGE_ROOT, 'index.html'),
        reader: join(PACKAGE_ROOT, 'reader.html'),
      },
      output: {
        format: 'cjs',
        exports: 'auto',
      },

      treeshake: true,

      external: [...builtinModules.flatMap((p) => [p, `node:${p}`])],
    },

    emptyOutDir: true,
    brotliSize: false,
    minify: false,
  },
  test: {
    environment: 'happy-dom',
  },
};

export default config;
