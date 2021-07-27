class RunPlugin {
  apply(compiler) {
    compiler.hooks.run.tap("RunPlugin", () => {
      console.log("开始编译了");
    });
  }
}

module.exports = RunPlugin;
