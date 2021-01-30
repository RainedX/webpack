/** @format */

const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.[hash:8].js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        // css-loader 处理@import语法
        // style-loader 把css插入到header标签中
        test: /\.css$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      filename: "index.html",
      minify: {
        collapseInlineTagWhitespace: true,
      },
      hash: true,
    }),
  ],
  devServer: {
    port: 3000,
    progress: true,
    contentBase: "./build",
  },
}
