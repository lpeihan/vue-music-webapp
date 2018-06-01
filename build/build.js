'use strict';

process.env.NODE_ENV = 'production';

const ora = require('ora');
const rm = require('rimraf');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackConfig = require('./webpack.prod.conf');
const { resolve } = require('./utils');

const spinner = ora('building for production...');
spinner.start();

rm(resolve('dist'), err => {
  if (err) {
    throw err;
  }
  webpack(webpackConfig, (err, stats) => {
    spinner.stop();
    if (err) {
      throw err;
    }
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n');

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
    }

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.yellow(
      '  Tip: The build folder is ready to be deployed.\n' +
      '  You may serve it with a static server:\n'
    ));
    console.log(chalk.cyan(
      '  npm install -g serve\n' +
      '  serve -s dist\n'
    ));
  });
});
