let babel = require("@babel/core")
let utils = require("loader-utils")

function loader(source) {
  let options = utils.getOptions(this)
  let cb = this.async()

  babel.transform(
    source,
    {
      ...options,
      sourceMaps: true,
      filename: this.resourcePath.split("/").pop(),
    },
    function (err, result) {
      // 异步
      cb(err, result.code, result.map)
    }
  )
}

module.exports = loader
