class SyncHook {
  constructor() {
    this.tasks = []
  }

  tap(name, task) {
    this.tasks.push(task)
  }

  call(...args) {
    this.tasks.forEach((task) => {
      task(...args)
    })
  }
}

class SyncBailHook {
  constructor() {
    this.tasks = []
  }

  tap(name, task) {
    this.tasks.push(task)
  }

  call(...args) {
    let result
    let index = 0

    do {
      result = this.tasks[index++](...args)
    } while (!result && index < this.tasks.length)
  }
}

// let hook = new SyncBailHook(["name"])

// hook.tap("react", (name) => {
//   console.log("react", name)
//   return "熔断，停止向下执行"
// })

// hook.tap("node", (name) => {
//   console.log("node", name)
// })

// hook.call("rain")

class SyncWaterfallHook {
  constructor() {
    this.tasks = []
  }

  tap(name, task) {
    this.tasks.push(task)
  }

  call(...args) {
    let [first, ...other] = this.tasks
    let ret = first(...args)

    other.reduce((prev, next) => next(prev), ret)
  }
}

let hook = new SyncWaterfallHook(["name"])

hook.tap("react", (name) => {
  console.log("react", name)
  return "react学的不错，传给下个钩子"
})

hook.tap("node", (name) => {
  console.log("node", name)
})

hook.call("rain")
