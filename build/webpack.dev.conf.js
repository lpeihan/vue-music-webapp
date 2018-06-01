'use strict';

const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const packageConfig = require('../package.json');
const baseWebpackConf = require('./webpack.base.conf');
const {
  resolve
} = require('./utils');

const host = '192.168.31.170';
const port = 8301;
const proxy = {};

module.exports = merge(baseWebpackConf, {
  devServer: {
    host,
    port,
    proxy,
    hot: true,
    inline: true,
    open: true,
    compress: true,
    quiet: true,
    clientLogLevel: 'warning',
    overlay: {
      errors: true,
      warnings: false
    },
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join('/', 'index.html') }
      ]
    }
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"development"'
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      title: packageConfig.name,
      inject: true,
      favicon: resolve('favicon.ico')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [
          `Your application is running here ${host}:${port}`
        ]
      },
      onErrors: function(severity, errors) {
        if (severity !== 'error') {
          return;
        }
        const error = errors[0];
        const filename = error.file.split('!').pop();
        notifier.notify({
          title: packageConfig.name,
          message: severity + ': ' + error.name,
          subtitle: filename || '',
          icon: path.resolve(__dirname, 'logo.png')
        });
      }
    })
  ]
});
