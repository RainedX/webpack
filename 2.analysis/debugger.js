const webpack = require('webpack');
const options = require('./webpack.config');
const compiler = webpack(options);
debugger
compiler.run((err, stats) => {
  console.log('error: ', err);
  console.log(JSON.stringify(stats.toJson({
    assets: true,
    modules: true,
    chunks: true,
    entries: true
  })));
});
