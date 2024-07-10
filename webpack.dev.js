const common = require('./webpack.common');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  devServer: { compress: true, historyApiFallback: true, open: true, port: 9000 },
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
