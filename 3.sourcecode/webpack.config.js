const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const RunPlugin = require("./plugins/run-plugin");
const DonePlugin = require("./plugins/done-plugin");
// const AssetPlugin = require("./plugins/assets-plugin");
module.exports = {
  mode: "development",
  devtool: false,
  entry: {
    index: path.resolve(__dirname, "./src/index.js")
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
  module: {
    rules: [],
  },
  plugins: [
    // new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["**/*"] }),
    // new HtmlWebpackPlugin({
    //   template: "./public/index.html",
    //   filename: "index.html",
    // }),
    new RunPlugin(),
    new DonePlugin()
  ],
};
