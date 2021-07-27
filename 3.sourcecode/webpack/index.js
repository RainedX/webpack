const Compiler = require('./Compiler');

function webpack(options) {
  let shellConfig = process.argv.slice(2).reduce((prev, cur) => {
    let [key, value] = cur.split('=');
    prev[key.slice(2)] = value;
    return prev;
  }, {});

  let mergeOptions = {...options, ...shellConfig};
  let compiler = new Compiler(mergeOptions);
  let { plugins } = mergeOptions;

  for (let plugin of plugins) {
    plugin.apply(compiler);
  }

  return compiler;
}

module.exports = webpack;