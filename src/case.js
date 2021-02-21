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

// let hook = new SyncWaterfallHook(["name"])

// hook.tap("react", (name) => {
//   console.log("react", name)
//   return "react学的不错，传给下个钩子"
// })

// hook.tap("node", (name) => {
//   console.log("node", name)
// })

// hook.call("rain")

// 异步并行
class AsyncParallelHook {
  constructor() {
    this.tasks = []
  }

  tapAsync(name, task) {
    this.tasks.push(task)
  }
  callAsync(...args) {
    let finalCallback = args.pop()
    let index = 0

    let done = () => {
      index++
      if (index === this.tasks.length) {
        finalCallback()
      }
    }
    this.tasks.forEach((task) => {
      task(...args, done)
    })
  }
}

let hook = new AsyncParallelHook(["name"])

hook.tapAsync("react", (name, cb) => {
  setTimeout(() => {
    console.log("react", name)
    cb()
  }, 1000)
})

hook.tapAsync("node", (name, cb) => {
  setTimeout(() => {
    console.log("node", name)
    cb()
  }, 1000)
})

hook.callAsync("rain", () => {
  console.log("end")
})
