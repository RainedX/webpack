// let moduleTitle = require("./title.js");
// console.log(moduleTitle);


// import name, { age } from "./title";
// console.log(name);
// console.log(age);

const btn = document.createElement('button');
btn.innerHTML = 'click';
btn.addEventListener('click', () => {
  import('./title.js').then(res => {
    console.log(res);
  })
});

document.body.appendChild(btn);