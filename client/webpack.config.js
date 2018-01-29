// webpack plugins
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const webpack = require('webpack');
const path = require('path');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: 'eval-source-map',
  entry: './src/index.js',
  output: {
    publicPath: '/static/build/',
    path: __dirname + "/build",
    filename: "bundle.[hash].js",

  },
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules']
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      },
      {
				test: /\.css$/,
        use: ExtractTextPlugin.extract({
            fallback:'style-loader',
            use:['css-loader'],
        })
			},
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['./build', '../server/portal/templates/base.html'], { watch: true}),
    new ngAnnotatePlugin({add:true}),
    new LiveReloadPlugin(),
    new HtmlWebpackPlugin(
      {
       inject : false,
       template : '../server/portal/templates/base.j2',
       filename: '../../server/portal/templates/base.html',
     }
   ),
   new ExtractTextPlugin({
			filename: "bundle.[hash].css"
		}),
  ],

  externals: {
    jQuery: 'jQuery',
    $: 'jQuery',
    jquery: 'jQuery',
    Modernizr: 'Modernizr',
    angular: 'angular',
    d3: 'd3',
    moment: 'moment',
    _: '_',
    _: 'underscore',
    L: 'L',
    window: 'window',
  }
};
