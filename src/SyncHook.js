// webpack本质上是一种事件流机制，他的工作流程就是将各个插件串联起来，而实现这一切的核心就是tapable，类似于node中的events库
const { SyncHook } = require("tapable")

class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncHook(["name"]),
    }
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tap("react", (name) => {
      console.log("react", name)
    })
    this.hooks.arch.tap("node", (name) => {
      console.log("node", name)
    })
  }
  start() {
    this.hooks.arch.call("rain")
  }
}

let l = new Lesson()
l.tap()
l.start()
