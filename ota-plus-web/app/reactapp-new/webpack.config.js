const { resolve } = require('path');

const jsOutput = 'assets/js';

const isProduction = process.env.NODE_ENV === 'development';

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
  devtool: 'source-map',
  devServer: {
    contentBase: resolve(__dirname, 'src'),
    https: true,
    disableHostCheck: true,
    port: 3000
  },
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
  }
};
