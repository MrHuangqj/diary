# 手写Promise

## 原理

利用setTimeout + 闭包的知识实现promise对象，支持异步调用和链式调用

## 代码

```
let statuses = ['pending', 'fulfilled', 'rejected']
class myPromise {
  constructor(callBack) {
    this.status = statuses[0];
    this.value = undefined;
    this.fulfillAry = [];
    this.rejectedAry = [];

    let resolveFn = result => {
      if (this.status !== statuses[0]) return;
      let timer = setTimeout(() => {
        this.status = statuses[1];
        this.value = result;
        this.fulfillAry.forEach(itm => itm(this.value))
      }, 0);
    }

    let rejectFn = reason => {
      if (this.status !== statuses[0]) return;
      let timer = setTimeout(() => {
        this.status = statuses[2];
        this.value = reason;
        this.rejectedAry.forEach(itm => itm(this.value))
      }, 0);
    }

    try {
      callBack(resolveFn, rejectFn);
    } catch (err) {
      rejectFn(err);
    }

  }
  then(fulfilledCallBack, rejectedCallBack) {
    typeof fulfilledCallBack !== 'function' ? fulfilledCallBack = result => result : null;
    typeof rejectedCallBack !== 'function' ? rejectedCallBack = reason => {
      throw new Error(reason instanceof Error ? reason.message : reason)
    } : null

    return new myPromise((resolve,reject)=>{
      this.fulfillAry.push(()=>{
        try {
          let x = fulfilledCallBack(this.value);
          x instanceof myPromise ? x.then(resolve, reject):resolve(x);
        } catch (error) {
          reject(error)
        }
      })
      this.rejectedAry.push(()=>{
        try {
          let x = rejectedCallBack(this.value);
          x instanceof myPromise ? x.then(resolve, reject) : reject(x)
        } catch (error) {
          reject(error)
        }
      })
    })
  }
}

```

## 测试

```
let p1 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    Math.random() < 0.5 ? resolve(100) : reject(-100);
  }, 1000)
})

let p2 = p1.then(result => {
  //执行then返回的是一个新的Promise
  return result + 100;
})
let p3 = p2.then(result => {
  console.log(result);
}, reason => {
  console.log(reason)
}).then(result => {
  console.log(result);
}, reason => {
  console.log(reason)
})
```
