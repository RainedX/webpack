const express = require("express")
const path = require("path")
const webpack = require("webpack")
const middleware = require("webpack-dev-middleware")
const config = require("./webpack.config")

const compiler = webpack(config)
const app = express()

app.use(middleware(compiler))
app.get("/api/user", (req, res) => {
  res.json({ name: "煮饭" })
})

app.listen(3000, () => {
  console.log("server is running ...")
})
