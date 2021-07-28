const path = require('path');
const fs = require('fs');
const types = require("babel-types");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require('@babel/generator').default;
const baseDir = toUnitPath(process.cwd());

function toUnitPath(filePath) {
  return filePath.replace(/\\/g, path.posix.sep);
}

class Compilation {
  constructor(options) {
    this.options = options;
    this.entries = []; // 存放所有的入口
    this.modules = []; // 存放所有的模块
    this.chunks = []; // 存放所的代码块
    this.assets = []; // 所有产出的资源
    this.files = []; // 所有产出的文件
  }

  build(callback) {
    let entry = {};

    if (typeof this.options.entry === 'string') {
      entry.main = this.options.entry;
    } else {
      entry = this.options.entry;
    }


    for (let entryName in entry) {
      let entryFilePath = toUnitPath(path.resolve(__dirname, '../', entry[entryName]));
      let entryModule = this.buildModule(entryName, entryFilePath);
    }
  }

  buildModule(name, modulePath) {
    let sourceCode = fs.readFileSync(modulePath, 'utf8');
    let rules = this.options.module.rules;
    let loaders = [];

    for (let i = 0, len = rules.length; i < len; i++) {
      let { test } = rules[i];

      if (modulePath.match(test)) {
        loaders.push(...rules[i].use);
      }
    }
    // 从数组的末尾先执行
    sourceCode = loaders.reduceRight((sourceCode, loader) => {
      return require(loader)(sourceCode);
    }, sourceCode);
    let ast = parser.parse(sourceCode, { sourceType: 'module' });

    traverse(ast, {
      CallExpression({ node }) {
        if (node.callee.name === 'require') {
          let moduleName = node.arguments[0].value;
          let dirname = path.posix.dirname(modulePath);
          let depModulePath = path.posix.join(dirname, moduleName);
          console.log(111, depModulePath);
          
        }
      }
    })
  }
}

module.exports = Compilation;