// 根据图片生成一个md5发射到dist目录下，file-loader返回当前图片路径
let loaderUtils = require("loader-utils")
function loader(source) {
  let filename = loaderUtils.interpolateName(this, "[hash].[ext]", {
    content: source,
  })

  this.emitFile(filename, source)

  return `module.exports = "${filename}"`
}

loader.raw = true // 二进制

module.exports = loader
