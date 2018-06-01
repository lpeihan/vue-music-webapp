'use strict';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

exports.resolve = function(dir = '') {
  return path.join(__dirname, '..', dir);
};

exports.assetsPath = function(_path) {
  return path.posix.join('static', _path);
};

exports.cssLoader = function(loader) {
  const loaders = [
    {
      loader: 'css-loader',
      options: { sourceMap: true }
    },
    {
      loader: 'postcss-loader',
      options: { sourceMap: true }
    }
  ];

  if (loader) {
    loaders.push({
      loader: `${loader}-loader`,
      options: { sourceMap: true }
    });
  }

  if (isProduction) {
    return ExtractTextPlugin.extract({
      use: loaders,
      fallback: 'vue-style-loader'
    });
  } else {
    return ['vue-style-loader'].concat(loaders);
  }
};

exports.vueLoaderConf = {
  loaders: {
    css: exports.cssLoader(),
    stylus: exports.cssLoader('stylus')
  },
  cssSourceMap: isProduction
};
