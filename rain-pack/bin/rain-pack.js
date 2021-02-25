#! /usr/bin/env node

// dirname总是指向被执行js文件的绝对路径
let path = require("path")
let config = require(path.resolve("webpack.config.js"))

let Compiler = require("../lib/Compiler")
let compiler = new Compiler(config)

compiler.hooks.entryOption.call()
compiler.run()
