const webpack = require('./webpack');
const options = require('./webpack.config');
const compiler = webpack(options);

compiler.run((err, stats) => {
  console.log(JSON.stringify(stats.toJson({
    assets: true,
    modules: true,
    chunks: true,
    entries: true
  })));
});
