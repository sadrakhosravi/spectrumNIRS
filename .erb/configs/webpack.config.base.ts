/**
 * Base webpack config used across other specific configs
 */

import webpack from 'webpack';
import webpackPaths from './webpack.paths';
import { dependencies as externals } from '../../release/app/package.json';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'; //Custom path alias

export default {
  externals: [...Object.keys(externals || {})],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Remove this line to enable type checking in webpack builds
            transpileOnly: true,
          },
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
    fallback: {
      crypto: false,
      'crypto-browserify': require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify
    },

    /* Custom path alias */
    plugins: [
      new TsconfigPathsPlugin({
        configFile: 'tsconfig.json', //Get all aliases from tsconfig.json
      }),
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};
