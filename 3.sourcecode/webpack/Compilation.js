const path = require("path");
const fs = require("fs");
const types = require("babel-types");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const baseDir = toUnitPath(process.cwd());

function toUnitPath(filePath) {
  return filePath.replace(/\\/g, path.posix.sep);
}

function tryExtensions(modulePath, extensions) {
  if (path.extname(modulePath)) {
    return modulePath;
  }
  for (let i = 0; i < extensions.length; i++) {
      let filePath = modulePath + extensions[i];// ./title.js
      if (fs.existsSync(filePath)) {
          return filePath;
      }
  }
  throw new Error(`Module not found`);
}

function getSource(chunk) {
  return `
  (() => {
      var modules = ({
          ${chunk.modules.map(module => `
                  "${module.id}":(module,exports,require)=>{
                      ${module._source}
                  }
              `).join(',')
      }
      });
      var cache = {};
      function require(moduleId) {
        var cachedModule = cache[moduleId];
        if (cachedModule !== undefined) {
          return cachedModule.exports;
        }
        var module = cache[moduleId] = {
          exports: {}
        };
        modules[moduleId](module, module.exports, require);
        return module.exports;
      }
      var exports = {};
      (() => {
       ${chunk.entryModule._source}
      })();
    })();
  `
}

class Compilation {
  constructor(options) {
    this.options = options;
    this.entries = []; // 存放所有的入口
    this.modules = []; // 存放所有的模块
    this.chunks = []; // 存放所的代码块
    this.assets = {}; // 所有产出的资源
    this.files = []; // 所有产出的文件
  }

  build(callback) {
    let entry = {};

    if (typeof this.options.entry === "string") {
      entry.main = this.options.entry;
    } else {
      entry = this.options.entry;
    }

    for (let entryName in entry) {
      let entryFilePath = toUnitPath(
        path.resolve(__dirname, "../", entry[entryName])
      );
      let entryModule = this.buildModule(entryName, entryFilePath);
      // getSource中已经包涵了入口模块
      // this.modules.push(entryModule);
      let chunk = {
        name: entryName,
        entryModule,
        modules: this.modules.filter(item => item.name === entryName)
      };
      this.entries.push(chunk);
      this.chunks.push(chunk);
    }
    /**
      this.chunks = [
        {
          name: 'main',
          entryModule: {
            id: './src/index.js',
            dependencies: [Array],
            name: 'main',
            _source: 'let title = require("./src/title.js");\n\nconsole.log(title);'
          },
          modules: [ [Object], [Object], [Object] ]
        },
        {
          name: 'entry2',
          entryModule: {
            id: './src/entry2.js',
            dependencies: [],
            name: 'entry2',
            _source: 'console.log("entry2");'
          },
          modules: [ [Object] ]
        }
      ]
    */
    this.chunks.forEach(chunk => {
      let filename = this.options.output.filename.replace('[name]', chunk.name);
      this.assets[filename] = getSource(chunk);
    });

   // this.assets = { 'main.js': 'xxx', 'entry2.js': 'xxx' }

    for (let filename in this.assets) {
      let filePath = path.join(this.options.output.path, filename);
      fs.writeFileSync(filePath, this.assets[filename], 'utf8');
    }

    callback(null, {
      entries: this.entries,
      chunks: this.chunks,
      modules: this.modules,
      files: this.files,
      assets: this.assets
    });
  }

  buildModule(name, modulePath) {
    let sourceCode = fs.readFileSync(modulePath, "utf8");
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
    let moduleId = './' + path.posix.relative(baseDir, modulePath);
    let module  = { id: moduleId, dependencies: [], name };
    let ast = parser.parse(sourceCode, { sourceType: "module" });

    traverse(ast, {
      CallExpression: ({ node }) => {
        if (node.callee.name === "require") {
          let moduleName = node.arguments[0].value;
          let depModulePath = "";

          //  获取依赖文件的绝对路径
          if (path.isAbsolute(moduleName)) {
            depModulePath = moduleName;
          } else {
            // 获得父文件所在的目录
            let dirname = path.posix.dirname(modulePath);
            depModulePath = path.posix.join(dirname, moduleName);
          }
          let extensions = this.options.resolve.extensions;
          depModulePath = tryExtensions(depModulePath, extensions);
          // 生成模块id
          let depModuleId = './' + path.posix.relative(baseDir, depModulePath);
          node.arguments = [types.stringLiteral(depModuleId)];

          module.dependencies.push({
            depModuleId,
            depModulePath
          });
        }
      },
    });

    let { code } = generator(ast);
    module._source = code;
    module.dependencies.forEach(({ depModuleId, depModulePath }) => {
      let dependencyModule = this.buildModule(name, depModulePath);
      this.modules.push(dependencyModule);
    });
    return module;
  }
}

module.exports = Compilation;

/**
 * 模块id(moduleId) ===> 相对于根目录的相对路径
 * chunkId
*/
