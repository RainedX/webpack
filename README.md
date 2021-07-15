<!-- @format -->

## webpack5.x

### 概述

`webpack`是一个用于现代`JavaScript`应用程序的静态模块打包工具。当`webpack`处理应用程序时，它会在内部构建一个 依赖图(`dependency graph`)，此依赖图对应映射到项目所需的每个模块，并生成一个或多个`bundle`。

### 安装

```javascript
npm install  webpack webpack-cli --save-dev
```

### entry

```javascript
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src/index.js"),
};
```

### output

```javascript
const path = require("path");

module.exports = {
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
};
```

### loader

```javascript
const path = require("path");

module.exports = {
  mode: "development",
  devtool: false,
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {
    rules: [{ test: /\.txt$/, use: "raw-loader" }],
  },
};
```

### plugin

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: false,
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {
    rules: [{ test: /\.txt$/, use: "raw-loader" }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/template.html"),
    }),
  ],
};
```

### 实现
