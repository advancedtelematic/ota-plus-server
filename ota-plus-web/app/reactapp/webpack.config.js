/** @format */

const { resolve } = require('path');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const jsOutput = 'assets/js';
const cssOutput = 'assets/css';

const isProduction = process.env.NODE_ENV === 'development';
/** must be the file containing ant.design's variables */
const themeColors = './css/ota-default/variables-ant.scss';

const cleaningOptions = {
  root: path.resolve(__dirname, '..'),
  verbose: true,
  exclude: ['jquery-3.3.1.min.js', 'lock-9.2.min.js', 'login.js', 'privay-notification.js'],
};

const foldersToClean = [jsOutput, cssOutput];

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: [resolve(__dirname, 'src/main.jsx'), resolve(__dirname, 'style/style.scss'), resolve(__dirname, 'style/unlogged.scss')],
  output: {
    path: resolve(__dirname, '..', jsOutput),
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new CleanWebpackPlugin(foldersToClean, cleaningOptions)
  ],
  devtool: 'source-map',
  module: {
    rules: [
      /*{
                enforce: "pre",
                test: /.(js|jsx)?$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
            },*/
      {
        test: /.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              context: './style/',
              //  output path referring to assets/css
              outputPath: '../css/' /* path must be relative to app.js */,
              publicPath: '../',
              name: '[name].css',
            },
          },
          {
            loader: 'extract-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProduction,
              minimize: isProduction,
            },
          },
          {
            loader: 'resolve-url-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProduction,
              minimize: isProduction,
            },
          },
        ],
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src'],
          },
        },
      },
    ],
  },
};
