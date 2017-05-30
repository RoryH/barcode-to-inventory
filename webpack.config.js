const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: './src/BarcodeToInventory.js',
  output: {
    filename: 'public/bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },
    {
      test: /\.scss$/,
      use: [{
        loader: 'style-loader' // translates CSS into CommonJS
      }, {
        loader: 'css-loader' // translates CSS into CommonJS
      }, {
        loader: 'sass-loader' // compiles Sass to CSS
      }]
    }]
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    })
  ]
};
