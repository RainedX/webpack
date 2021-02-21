// 异步串行钩子
const { AsyncSeriesHook } = require("tapable")

class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncSeriesHook(["name"]),
    }
  }
  // 注册监听函数
  tap() {
    // tapPromise
    this.hooks.arch.tapAsync("react", (name, cb) => {
      setTimeout(() => {
        console.log("react", name)
        cb()
      }, 1000)
    })
    this.hooks.arch.tapAsync("node", (name, cb) => {
      setTimeout(() => {
        console.log("node", name)
        cb()
      }, 1000)
    })
  }
  start() {
    this.hooks.arch.callAsync("rain", function () {
      console.log("end")
    })
  }
}

let l = new Lesson()
l.tap()
l.start()
