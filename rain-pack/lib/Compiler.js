let fs = require("fs")
let path = require("path")
let t = require("@babel/types")
let babelParser = require("@babel/parser")
let traverse = require("@babel/traverse").default
let generator = require("@babel/generator").default
let ejs = require("ejs")
// @babel/parser @babel/traverse @babel/types @babel/generator
class Compiler {
  constructor(config) {
    this.config = config
    this.entryId
    this.modules = {}
    this.entry = config.entry
    this.root = process.cwd()
  }
  run() {
    this.buildModule(path.resolve(this.root, this.entry), true)
    // 发射文件
    this.emitFile()
  }
  emitFile() {
    // 输出到哪个目录
    let main = path.resolve(
      this.config.output.path,
      this.config.output.filename
    )
    let templateStr = this.getSource(path.resolve(__dirname, "main.ejs"))
    let code = ejs.render(templateStr, {
      entryId: this.entryId,
      modules: this.modules,
    })
    this.assets = {}
    this.assets[main] = code
    fs.writeFileSync(main, this.assets[main])
  }
  getSource(modulePath) {
    let content = fs.readFileSync(modulePath, "utf-8")
    return content
  }
  parse(source, parentPath) {
    let ast = babelParser.parse(source)
    let dependncies = []
    traverse(ast, {
      CallExpression(p) {
        let node = p.node
        if (node.callee.name === "require") {
          node.callee.name = "__webpack_require__"
          let moduleName = node.arguments[0].value
          moduleName = moduleName + (path.extname(moduleName) ? "" : ".js")
          moduleName = "./" + path.join(parentPath, moduleName)

          dependncies.push(moduleName)
          node.arguments = [t.stringLiteral(moduleName)]
        }
      },
    })

    let sourceCode = generator(ast).code
    return { sourceCode, dependncies }
  }
  buildModule(modulePath, isEntry) {
    let source = this.getSource(modulePath)
    let moduleName = "./" + path.relative(this.root, modulePath)

    if (isEntry) {
      this.entryId = moduleName
    }
    // source源码改造，返回一个依赖列表
    let { sourceCode, dependncies } = this.parse(
      source,
      path.dirname(moduleName)
    )

    dependncies.forEach((dep) => {
      this.buildModule(path.resolve(this.root, dep), false)
    })

    this.modules[moduleName] = sourceCode
  }
}

module.exports = Compiler
