const { resolve } = require('path');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const jsOutput = 'assets/js';

const isProduction = process.env.NODE_ENV === 'development';

const cleaningOptions = {
  root: path.resolve(__dirname, '..'),
  verbose: true,
  exclude: ['jquery-3.3.1.min.js', 'lock-9.2.min.js', 'login.js', 'privay-notification.js'],
};

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: [
    resolve(__dirname, 'src/index.tsx'),
    resolve(__dirname, 'style/index.scss')
  ],
  output: {
    path: resolve(__dirname, '..', jsOutput),
    filename: 'app-new.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(cleaningOptions)
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
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
              name: 'index.css',
            },
          },
          {
            loader: 'extract-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'resolve-url-loader',
          },
          {
            loader: 'sass-loader',
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
