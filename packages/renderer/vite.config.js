/* eslint-env node */

import { chrome } from '../../.electron-vendors.cache.json';
import { join } from 'path';
import { builtinModules } from 'module';

// Plugins
import reactVite from '@vitejs/plugin-react';
import electronRenderer from 'vite-plugin-electron/renderer';
import polyfillExports from 'vite-plugin-electron/polyfill-exports';
import resolve, { lib2esm } from 'vite-plugin-resolve';

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
    resolve({
      sqlite3: 'export default require("sqlite3");',
      'better-sqlite3': 'export default require("better-sqlite3");',

      // Use lib2esm() to easy to convert ESM
      serialport: lib2esm(
        // CJS lib name
        'serialport',
        // export members
        ['SerialPort', 'SerialPortMock'],
        { format: 'cjs' },
      ),
      v8: lib2esm(
        // CJS lib name
        'v8',
        // export members
        ['serialize'],
        { format: 'cjs' },
      ),
      typeorm: lib2esm(
        // CJS lib name
        'typeorm',
        // export members
        [
          'DataSource',
          'Entity',
          'PrimaryGeneratedColumn',
          'Column',
          'OneToMany',
          'OneToOne',
          'ManyToOne',
          'JoinColumn',
          'JoinTable',
        ],
        { format: 'cjs' },
      ),

      'lz4-napi': lib2esm('lz4-napi', ['compress', 'uncompress', 'compressSync', 'uncompressSync']),

      snappy: 'export default require("snappy");',
    }),
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
      external: [...builtinModules.flatMap((p) => [p, `node:${p}`])],
    },
    output: {
      format: 'cjs',
    },
    sourcemap: 'inline',
  },
  build: {
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    sourcemap: 'inline',

    rollupOptions: {
      input: {
        main: join(PACKAGE_ROOT, 'index.html'),
        reader: join(PACKAGE_ROOT, 'reader.html'),
      },

      commonjsOptions: { exclude: ['typeorm'], include: [] }, // <----

      output: {
        format: 'cjs',
      },
      external: [
        'typeorm',
        'better-sqlite3',
        'sqlite3',
        'v8',
        ...builtinModules.flatMap((p) => [p, `node:${p}`]),
      ],
    },

    emptyOutDir: true,
    brotliSize: false,
    minify: 'terser',
  },
  worker: {
    rollupOptions: {
      output: {
        format: 'cjs',
      },
    },
  },
  test: {
    environment: 'happy-dom',
  },
};

export default config;
