const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FileManagerWebpackPlugin = require("filemanager-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  devtool: 'source-map',
  entry: {
    index: path.resolve(__dirname, "src/index.js"),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  // {
                  //   useBuiltIns: 'usage', // 按需要加载polyfill
                  //   corejs: {
                  //     version: 3, // 指定core-js版本
                  //   },
                  // }
                ],
                "@babel/preset-react"
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            esModule: false,
            name: 'avatar.[ext]',
            limit: 8 * 1024
          }
        }]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/template.html"),
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*']
    }),
    // new webpack.SourceMapDevToolPlugin({
    //   filename: '[file].map',
    //   append: '\n//# sourceMappingURL=http://localhost:3000/[url]',
    // }),
    // new FileManagerWebpackPlugin({
    //   events: {
    //     onEnd: {
    //       copy: [{
    //         source: './dist/*.map',
    //         destination: path.resolve(__dirname, 'sourcemap')
    //       }],
    //       delete: ['./dist/*.map']
    //     }
    //   }
    // })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000
  },
};
