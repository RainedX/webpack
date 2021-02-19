const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const webpack = require("webpack")

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: "js/[name].[hash:8].js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              // es6转es5
              presets: ["@babel/preset-env", "@babel/preset-react"],
              // 转换class
              plugins: [
                ["@babel/plugin-proposal-class-properties"],
                ["@babel/plugin-transform-runtime"],
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["vendor.js", "manifest.json"],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      filename: "index.html",
      chunks: ["index"],
      minify: {
        collapseInlineTagWhitespace: true,
      },
      hash: true,
    }),
  ],
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    contentBase: "./build",
  },
}
