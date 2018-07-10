const path = require("path");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: {
    app: __dirname + "/public/js/common.js"
  },
  devtool: "inline-source-map",
  mode: "development",
  output: {
    filename: "bundle.js",
    path: __dirname + "/public/dist"
  },
  node: {
    fs: 'empty'
  }
};
