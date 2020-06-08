const path = require("path");
const webpack = require("webpack");
const express = require("express");

module.exports = {
  mode: "development",
  devtool: 'inline-source-map',
  target: 'web',
  entry: path.resolve(__dirname, "src/index"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
            plugins: ["@babel/plugin-transform-spread", "@babel/plugin-transform-react-jsx", "@babel/plugin-proposal-class-properties"]
          }
        }
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {loader: "style-loader"},
          {loader: "css-loader"},
          {loader: "sass-loader"}
        ]
      },
      {
        test: /\.(gif|jpe?g|png|svg)$/i,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  // externals: {
  //   react: "react"
  // },
  stats: 'errors-warnings',
  devServer: {
    proxy: { // proxy URLs to backend development server
      '/api': 'http://localhost:3001'
    },
    after: function(app, server) {
      app.get('*', function(req, res) {
        res.sendFile(path.resolve(__dirname, "src/index.html"));
      });
    },
    port: 3002,
    contentBase: path.resolve(__dirname, 'src'),
    open: true,
    overlay: true,
    compress: true, // enable gzip compression
    // historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
  },
}
