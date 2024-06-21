const common = require('./webpack.common')
const webpackMerge = require('webpack-merge');
const { getCustomWebPack } = require('./getEntry');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
//custom config
let customWebpack = getCustomWebPack('production');
if (typeof customWebpack === 'function') {
  customWebpack = customWebpack(common)
}

process.env.NODE_ENV = 'production';
module.exports = webpackMerge.merge(common, {
  mode: 'production',
  devtool: false,
}, customWebpack?.webpack || {})