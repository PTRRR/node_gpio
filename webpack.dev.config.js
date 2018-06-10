const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const nodeModules = {}
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

const clientConfig = {
  entry: {
    'app': './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dev/socket'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      { 
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.sass$/,
        loader: 'style-loader!css-loader!sass-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    }),
    new CleanWebpackPlugin([
      './dist'
    ])
  ]
}

module.exports = [clientConfig]