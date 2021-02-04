const path = require("path")
const webpack = require("webpack")

module.exports = {
  mode: "development",
  entry: {
    vendor: ["react", "react-dom"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
    library: "[name]", // 打包后结果赋值给一个变量
    libraryTarget: "var", // commonjs umd
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]",
      path: path.resolve(__dirname, "build", "manifest.json"), //任务清单
    }),
  ],
}
