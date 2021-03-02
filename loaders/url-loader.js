// url-loader
// 1 先交给file-loader处理
let utils = require("loader-utils")
let mime = require("mime")
function loader(source) {
  let options = utils.getOptions(this)
  let { limit } = options
  if (limit && limit > source.length) {
    return `module.exports="data:${mime.getType(
      this.resourcePath
    )};base64,${source.toString("base64")}"`
  } else {
    return require("./file-loader").call(this, source)
  }
}

loader.raw = true

module.exports = loader
