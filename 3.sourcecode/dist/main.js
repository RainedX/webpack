
  (() => {
      var modules = ({
          
                  "./src/name.js":(module,exports,require)=>{
                      module.exports = 'name';
                  }
              ,
                  "./src/title.js":(module,exports,require)=>{
                      const name = require("./src/name.js");

console.log(111, name);
module.exports = 'title';
                  }
              
      });
      var cache = {};
      function require(moduleId) {
        var cachedModule = cache[moduleId];
        if (cachedModule !== undefined) {
          return cachedModule.exports;
        }
        var module = cache[moduleId] = {
          exports: {}
        };
        modules[moduleId](module, module.exports, require);
        return module.exports;
      }
      var exports = {};
      (() => {
       let title = require("./src/title.js");

console.log(title);
      })();
    })();
  