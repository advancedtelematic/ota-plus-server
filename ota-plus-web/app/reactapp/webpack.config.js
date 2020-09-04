/** @format */

const { resolve } = require('path');

const jsOutput = 'assets/js';

const isProduction = process.env.NODE_ENV === 'development';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: [
    resolve(__dirname, 'src/main.jsx'),
    resolve(__dirname, 'style/style.scss'),
    resolve(__dirname, 'style/unlogged.scss')
  ],
  output: {
    path: resolve(__dirname, '..', jsOutput),
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devtool: 'source-map',
  module: {
    rules: [
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
