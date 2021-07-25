const core = require("@babel/core");
const transformClasses = require("@babel/plugin-transform-classes");
const types = require("babel-types");

const es6Code = `class Person{
  constructor(name){
      this.name = name;
  }
  getName(){
      return this.name;
  }
}
`;

const transformClasses2 = {
  visitor: {
    ClassDeclaration(nodePath) {
      let node = nodePath.node;
      let id = node.id;
      let methods = node.body.body;
      let nodes = [];
      methods.forEach((classMethod) => {
        if (classMethod.kind === "constructor") {
          let constructorFunction = types.functionDeclaration(
            id,
            classMethod.params,
            classMethod.body,
            classMethod.generator,
            classMethod.async
          );

          nodes.push(constructorFunction);
        } else {
          let prototypeMemberExpression = types.memberExpression(
            id,
            types.identifier("prototype")
          );
          let keyMemberExpression = types.memberExpression(
            prototypeMemberExpression,
            classMethod.key
          );

          let memberFunction = types.functionExpression(
            null,
            classMethod.params,
            classMethod.body,
            classMethod.generator,
            classMethod.async
          );

          let assignmentExpression = types.assignmentExpression('=', keyMemberExpression, memberFunction);

          nodes.push(assignmentExpression);
        }
      });

      nodePath.replaceWithMultiple(nodes);
    },
  },
};

const es5Code = core.transform(es6Code, {
  plugins: [transformClasses2],
});

console.log(es5Code.code);
