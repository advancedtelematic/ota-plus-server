/** @format */

const { resolve } = require('path');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const mainEntry = resolve(__dirname, 'src/main.jsx');
const styleEntry = resolve(__dirname, 'styles/style.scss');
const unloggedCSS = resolve(__dirname, 'styles/unlogged.scss');
const jsTarget = resolve(__dirname, '..', 'assets/js');
const styleTarget = resolve(__dirname, '..', 'assets/css');
const styleSource = resolve(__dirname, 'styles/');

const isProduction = process.env.NODE_ENV !== 'development';
/** must be the file containing ant.design's variables */
const antDesignThemeColors = './css/ota-default/theme.scss';

const cleaningOptions = {
  root: path.resolve(__dirname, '..'),
  verbose: true,
  exclude: ['jquery-3.3.1.min.js', 'lock-9.2.min.js', 'login.js', 'privay-notification.js'],
  watch: true,
};

const targets = [jsTarget, styleTarget];

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: mainEntry,
    styles: styleEntry,
    unlogged: unloggedCSS,
  },
  output: {
    path: jsTarget,
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [new CleanWebpackPlugin(targets, cleaningOptions)],
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
        test: /.(jsx)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.less$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'less-loader', options: { javascriptEnabled: true } }],
      },
      {
        test: /\.scss$/,
        issuer: {
          exclude: /\.less$/,
        },
        use: [
          {
            loader: 'style-loader',
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
        // This rule will only be used for converting our sass-variables to less-variables
        test: /\.scss$/,
        issuer: /\.less$/,
        use: {
          loader: './styles/helpers/sassVarsToLess.js',
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
  },
};
