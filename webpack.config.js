const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FileManagerWebpackPlugin = require("filemanager-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

console.log("webpack: ", process.env.NODE_ENV);
module.exports = {
  mode: "development",
  devtool: 'source-map',
  entry: {
    index: path.resolve(__dirname, "src/index.js"),
    main: path.resolve(__dirname, "src/main.js")
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
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/document'),
          to: path.resolve(__dirname, 'dist/document`')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
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
