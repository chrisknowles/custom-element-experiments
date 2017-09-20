const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');

const dir_js    = path.resolve(__dirname, 'src/js/');
const dir_html  = path.resolve(__dirname, 'src/html');
const dir_build = path.resolve(__dirname, 'dev');

module.exports = env => ({
  entry: {
    app: path.resolve(dir_js, 'app.js'),
    vendor: ['rxjs', 'snabbdom']
  },
  output: {
    filename: 'bundle.[name].js',
    path: dir_build,
    pathinfo: !env.prod
  },
  context: path.resolve(__dirname, 'src'),
  resolve: {
    modules: [
      path.resolve('./src/js'),
      path.resolve('./node_modules')
    ]
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
        query: {},
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new HtmlWebpackPlugin({
      template: './html/index.html'
    })
  ],
  stats: {
    colors: true
  },
  devtool: 'source-map'
});
