const babelCore = require('@babel/core');
const types = require('babel-types');
const BabelPluginTransformEs2015ArrowFunctions = require('babel-plugin-transform-es2015-arrow-functions');
const sourceCode = `
  const sum = (a,b)=>{
      console.log(this);
      return a+b;
  }
`;

let BabelPluginTransformEs2015ArrowFunctions2 = {
  visitor: {
    ArrowFunctionExpression(nodePath) {
      let node = nodePath.node;
      const thisBinding = hoistFunctionEnvironment(nodePath);
      node.type = 'FunctionExpression'
    }
  }
}

function hoistFunctionEnvironment(nodePath) {
  const thisEnvFn = nodePath.findParent(p => {
    return (p.isFunction() && !p.isArrowFunctionExpression()) || p.isProgram()
  })

  let thisPaths = getScopeInfoInformation(nodePath);

  if (thisPaths.length) {
    thisEnvFn.scope.push({
      id: types.identifier('_this'),
      init: types.thisExpression()
    });

    thisPaths.forEach(item => {
      item.replaceWith(types.identifier('_this'))
    });
  }
}

function getScopeInfoInformation(nodePath) {
  let thisPaths = [];

  // 遍历
  nodePath.traverse({
    ThisExpression(thisPath) {
      thisPaths.push(thisPath);
    }
  });

  return thisPaths;
}

// @babel/core本身只是生成语法树，遍历语法树，生成代码
let targetCode = babelCore.transform(sourceCode, {
  plugins: [BabelPluginTransformEs2015ArrowFunctions2]
})

console.log(targetCode.code);