console.log($)

const str = require("./two")

console.log(111, str)

require("./index.css")

let fn = () => {
  console.log(123)
}
fn()

class A {
  a = 1
}

function* gen() {
  yield 1
}

gen()
import logo from "./im.png"
let image = new Image()
image.src = logo
document.body.appendChild(image)
