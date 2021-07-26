const core = require("@babel/core");
const types = require("babel-types");
const template = require('@babel/template');
const es6Code = `
function sum(a, b) {
  return a + b + c;
}
`;

const tryCode = {
  visitor: {
    FunctionDeclaration(nodePath) {
      let node = nodePath.node;
      let id = node.id;

      let blockStatement = node.body;

      if (blockStatement.body && types.isTryStatement(blockStatement.body[0])) {
        return;
      }

      let catchStatement = template.statement('console.log(error)')();
      let catchClause = types.catchClause(types.identifier('error'), types.blockStatement([catchStatement]));

      let tryStatement = types.tryStatement(node.body, catchClause);

      const func = types.functionExpression(
        id,
        node.params,
        types.BlockStatement([tryStatement]),
        node.generator,
        node.async
      );

      nodePath.replaceWith(func);
    },
  },
};

const es5Code = core.transform(es6Code, {
  plugins: [tryCode],
});

console.log(es5Code.code);
