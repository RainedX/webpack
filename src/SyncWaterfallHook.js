// tap事件相互关联
const { SyncWaterfallHook } = require("tapable")

class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncWaterfallHook(["name"]),
    }
  }

  tap() {
    this.hooks.arch.tap("react", (name) => {
      console.log("react", name)
    })

    this.hooks.arch.tap("node", (data) => {
      console.log("node", data)

      return "xxx"
    })

    this.hooks.arch.tap("java", (data) => {
      console.log("java", data)
    })
  }

  start() {
    this.hooks.arch.call("rain")
  }
}

const l = new Lesson()
l.tap()
l.start()
