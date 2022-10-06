```
Function.prototype.myCall = function(thisArg, ...args){
  const fn = Symbol('fn');
  thisArg = thisArg || window;

  thisArg[fn] = this;

  const result = thisArg[fn](...args);

  delete thisArg[fn];

  return result;
}

function foo(){
  console.log(this.name);
}

let obj = {
  name: '写代码像蔡徐坤'
};

foo.myCall(obj)
```
