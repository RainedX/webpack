// 同步遇到不返回undefined的多次执行
const { SyncLoopHook } = require("tapable")

class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncLoopHook(["name"]),
    }
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tap("react", (name) => {
      console.log("react", name)
      return "react"
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
