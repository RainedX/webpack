let fs = require("fs")
let path = require("path")
let t = require("@babel/types")
let babelParser = require("@babel/parser")
let traverse = require("@babel/traverse").default
let generator = require("@babel/generator").default
let ejs = require("ejs")
let { SyncHook } = require("tapable")
// @babel/parser @babel/traverse @babel/types @babel/generator
class Compiler {
  constructor(config) {
    this.config = config
    this.entryId
    this.modules = {}
    this.entry = config.entry
    this.root = process.cwd()
    this.hooks = {
      entryOption: new SyncHook(),
      compile: new SyncHook(),
      afterCompile: new SyncHook(),
      afterPlugins: new SyncHook(),
      run: new SyncHook(),
      emit: new SyncHook(),
      done: new SyncHook(),
    }
    let plugins = this.config.plugins
    if (Array.isArray(plugins)) {
      plugins.forEach((plugin) => {
        plugin.apply(this)
      })
    }
    this.hooks.afterPlugins.call()
  }
  run() {
    this.hooks.run.call()
    this.hooks.compile.call()
    this.buildModule(path.resolve(this.root, this.entry), true)
    this.hooks.afterCompile.call()
    // 发射文件
    this.emitFile()
    this.hooks.emit.call()
    this.hooks.done.call()
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
    let rules = this.config.module.rules
    let content = fs.readFileSync(modulePath, "utf-8")
    // 拿到每个规则
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i]
      let { test, use } = rule
      let len = use.length - 1
      if (test.test(modulePath)) {
        //获取对应的loader函数
        function normalLoader() {
          let loader = require(use[len--])
          content = loader(content)
          if (len >= 0) {
            normalLoader()
          }
        }
        normalLoader()
      }
    }
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
