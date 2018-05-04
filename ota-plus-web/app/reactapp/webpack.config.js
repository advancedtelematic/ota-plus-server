const { join, resolve } = require('path');
const webpack = require('webpack');

process.traceDeprecation = true

const optimize = new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
    screw_ie8: true,
    conditionals: true,
    unused: true,
    comparisons: true,
    sequences: true,
    dead_code: true,
    evaluate: true,
    if_return: true,
    join_vars: true,
  },
  output: {
    comments: false,
  },
});

module.exports = {
  entry: [
    join(__dirname, 'src/main.jsx'),
    join(__dirname, 'css/style.scss'),
    join(__dirname, 'css/unlogged.scss'),
  ],
  output: {
    path: join(__dirname, '../assets/js'),
    filename: "app.js"
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        include: join(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              plugins: [
                'transform-decorators-legacy',
              ],
              presets: [
                ['es2015', { modules: false }],
                'react',
                'stage-1'
              ],
            }
          },
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
              options: {
                name: '[name].css',
                context: './css/',
                outputPath: '../css/',
                publicPath: '../'
              }
          },
          {
            loader: 'extract-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              minimize: true,
            }
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
              minimize: true,
            }
          }
        ]
      },
        {
          test: /\.(html)$/,
          use: {
            loader: 'html-loader',
            options: {
                attrs: [':data-src']
            }
          }
        }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
  ]
};