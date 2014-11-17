/**
 * Copyright (c) 2014 Ceane Lamerez
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

"use strict";

var express = require('express');
var app = express();
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var assign = require('./assign'); //jshint ignore:line
var config = require('./webpack.config');
var reactHotConfig = {
  entry: [
    'webpack-dev-server/client?http://localhost:'+config.port,
    'webpack/hot/dev-server',
  ].concat(Object.keys(config.entry).map(function(key) {
    return config.entry[key];
  })),
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      { test: /.jsx/, loaders: ['react-hot'] },
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['6to5-loader'] }
    ]
  }
};

var WebPackConfig = Object.assign(config, reactHotConfig);
app.listen(config.port+1);

new WebpackDevServer(webpack(WebPackConfig), {
  publicPath: WebPackConfig.output.publicPath,
  hot: true
}).listen(config.port, 'localhost', function (err) {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:'+config.port);
});
