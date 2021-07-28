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
    main: "./src/index.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, './loaders/logger1-loader.js'),
          path.resolve(__dirname, './loaders/logger2-loader.js'),
          path.resolve(__dirname, './loaders/logger3-loader.js')
        ]
      }
    ],
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
