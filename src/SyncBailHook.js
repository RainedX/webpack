const { SyncBailHook } = require("tapable")

class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncBailHook(["name"]),
    }
  }

  tap() {
    this.hooks.arch.tap("react", (name) => {
      console.log("react", name)

      // 返回结果不是undefined的就会触发熔断
      return "熔断，停止向下执行"
    })

    this.hooks.arch.tap("node", (name) => {
      console.log("node", name)
    })
  }

  start() {
    this.hooks.arch.call("rain")
  }
}

const l = new Lesson()
l.tap()
l.start()
