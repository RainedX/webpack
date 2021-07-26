const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [path.resolve(__dirname, 'src/babel-plugin-import.js'), {
                libraryName: 'lodash',
                libraryDirectory: 'fp'
              }]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["**/*"] }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
  ],
  devServer: {},
};
