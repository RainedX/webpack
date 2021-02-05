const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const webpack = require("webpack")

module.exports = {
  mode: "production",
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
  entry: {
    index: "./src/index.js",
    other: "./src/other.js",
  },
  output: {
    filename: "js/[name].[hash:8].js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    noParse: /jquery/, // 不去解析jquery中的依赖库
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
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
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
              limit: 1024,
              outputPath: "img",
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
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "build", "manifest.json"),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index1.html"),
      filename: "index.html",
      chunks: ["index"],
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
      filename: "css/[name].css",
    }),
  ],
  //  通过cdn引入
  externals: {
    jquery: "$",
  },
  watch: true,
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 500,
    ignored: /node_modules/,
  },
  resolve: {
    modules: [path.resolve("node_modules")],
  },
  devtool: "cheap-module-eval-source-map",
  devServer: {
    port: 3000,
    progress: true,
    open: true,
    contentBase: "./build",
    proxy: {
      "/api": {
        target: "http://localhost:9000/",
        pathRewrite: { "/api": "/" },
      },
    },
  },
}
