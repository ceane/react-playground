module.exports = {
  entry: [
    './src/app'
  ],
  output: {
    path: __dirname,
    filename: '[name].js',
    hotUpdateMainFilename: '[hash].hot-update.json'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['web_modules', 'node_modules', 'lib']
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['6to5-loader'] }
    ]
  },
  port: 8858
};