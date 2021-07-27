class DonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap("DonePlugin", () => {
      console.log("编译结束了");
    });
  }
}

module.exports = DonePlugin;
