const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const webpack = require("webpack")

module.exports = {
  mode: "development",
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCssAssetsPlugin({}),
    ],
  },
  entry: "./src/index.js",
  output: {
    filename: "bundle.[hash:8].js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [
      // {
      //   test: require.resolve("jquery"),
      //   loader: "expose-loader",
      //   options: {
      //     exposes: ["jquery"],
      //   },
      // },
      {
        // css-loader 处理@import语法
        // style-loader 把css插入到header标签中
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 2000 * 1024,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ["html-withimg-loader"],
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              // es6转es5
              presets: ["@babel/preset-env"],
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
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      filename: "index.html",
      minify: {
        collapseInlineTagWhitespace: true,
      },
      hash: true,
    }),
    new webpack.ProvidePlugin({
      // 在每个模块中注入$符
      $: "jQuery", // value值不是随意自定义的，插件对外暴露的
    }),
    new MiniCssExtractPlugin({
      filename: "main.[hash:8].css",
    }),
  ],
  //  通过cdn引入
  externals: {
    jquery: "$",
  },
  devServer: {
    port: 3000,
    progress: true,
    contentBase: "./build",
  },
}
