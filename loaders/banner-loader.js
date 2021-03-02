let utils = require("loader-utils")
let schemaUtils = require("schema-utils")
let fs = require("fs")

function loader(source) {
  let options = utils.getOptions(this)
  let cb = this.async()
  let schema = {
    type: "object",
    properties: {
      text: {
        type: "string",
      },
      filename: {
        type: "string",
      },
    },
  }

  schemaUtils.validate(schema, options, "banner-loader")

  if (options.filename) {
    // 监听文件
    this.addDependency(options.filename)
    fs.readFile(options.filename, "utf-8", function (err, data) {
      cb(err, `/**${data}**/${source}`)
    })
  } else {
    cb(null, `/**${options.text}**/${source}`)
  }
}

module.exports = loader
