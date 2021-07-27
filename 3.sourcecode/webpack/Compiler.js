let { SyncHook } = require('tapable');
let path = require('path');
let fs = require('fs');

class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(), //开始启动编译 刚刚开始
      done: new SyncHook() //将会在完成编译的时候触发 全部完成
    };
  }

  run() {
    this.hooks.run.call();
    // 根据配置中的entry找到入口文件
    let entry = this.options.entry;

    this.hooks.done.call();
  }
  compile() {}
}

module.exports = Compiler;