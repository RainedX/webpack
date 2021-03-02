const path = require("path")

class Plugin1 {
  apply(compiler) {
    compiler.hooks.emit.tap("emit", function () {
      console.log("emit")
    })
  }
}

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolveLoader: {
    modules: ["node_modules", path.resolve(__dirname, "loaders")],
  },
  // watch: true,
  devtool: "source-map",
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: [
      //     {
      //       loader: "babel-loader",
      //       options: {
      //         presets: ["@babel/preset-env"],
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.png$/,
        use: ["file-loader"],
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: "banner-loader",
            options: {
              text: "rain",
              filename: path.resolve(__dirname, "banner.js"),
            },
          },
        ],
      },
    ],
  },
  plugins: [new Plugin1()],
}
