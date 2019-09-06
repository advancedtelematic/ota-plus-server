const { resolve } = require('path');

module.exports = {
  entry: [
    resolve(__dirname, 'src/index.tsx'),
    resolve(__dirname, 'style/index.scss')
  ],
  output: {
    path: resolve(__dirname, '..', 'assets/js'),
    filename: 'app-new.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
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
